import csv
import os

from google.auth import default
from google.auth.exceptions import DefaultCredentialsError
from google.cloud.sql.connector import Connector
import sqlalchemy


def find_weighted_pnl(mov):
    num_teams = len(mov)  # number of teams
    weights = [1 / num_teams for i in range(num_teams)]
    ITERS = 100
    a = 1 - 2 / num_teams  # hyper parameter tuning...
    newW = [
        (1 - a) / (1 - pow(a, num_teams)) * pow(a, i) for i in range(0, num_teams)
    ]  # exponential weights (sum to 1)
    for x in range(ITERS):
        items = []
        for i in range(num_teams):
            items.append([sum([mov[i][j] * weights[j] for j in range(num_teams)]), i])
        items.sort(reverse=True)
        for i in range(num_teams):
            weights[items[i][1]] = newW[i]
    return items


def calculate_margin_of_victory(matches, num_teams):
    mov = [[0 for _ in range(num_teams)] for _ in range(num_teams)]
    for scores in matches:
        assert len(scores) == 2
        i, iscore = scores[0]
        j, jscore = scores[1]
        mov[i][j] = iscore - jscore  # confirm?
        mov[j][i] = -mov[i][j]
    return mov


"""
Returns (T, idxs, matches), where:
    T = number of teams
    idxs[teamId] = numerical index i for looking up teamId, where 0 <= i < T
    matches = list of [(i, bankroll_i), (j, bankroll_j)],
                where in a match between teams i and j,
                    i scored bankroll_i and j scored bankroll_j
    """


def parse_matches(matches_rows):
    match_dict = {}
    idx = 0
    team_to_idxs = {}
    idxs_to_team = {}

    for row in matches_rows:
        teamId = row["teamId"]
        matchId = row["matchId"]
        score = int(row["bankroll"])
        if matchId not in match_dict:
            match_dict[matchId] = []
        if teamId not in team_to_idxs:
            team_to_idxs[teamId] = idx
            idxs_to_team[idx] = teamId
            idx += 1
        match_dict[matchId].append((team_to_idxs[teamId], score))

    return idx, team_to_idxs, idxs_to_team, match_dict.values()


"""
Same as parse_matches but takes .csv exported from TeamMatchDao
NOTE: Must manually add "id,matchId,teamId,bankroll" as the first line in the
csv file, so that this script knows the names of each column.
"""


def parse_matches_csv(filename):
    match_dict = {}
    idx = 0
    team_to_idxs = {}
    idxs_to_team = {}

    with open(filename, newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            teamId = row["teamId"]
            matchId = row["matchId"]
            score = int(row["bankroll"])
            if matchId not in match_dict:
                match_dict[matchId] = []
            if teamId not in team_to_idxs:
                team_to_idxs[teamId] = idx
                idxs_to_team[idx] = teamId
                idx += 1
            match_dict[matchId].append((team_to_idxs[teamId], score))

    return idx, team_to_idxs, idxs_to_team, match_dict.values()


def get_credentials():
    try:
        credentials, _ = default()
        return credentials
    except DefaultCredentialsError:
        print(
            "Google Cloud Authentication credentials not found, writing logs locally."
        )
        return None


def get_matches():
    instance_connection_name = os.getenv("INSTANCE_CONNECTION_NAME")
    db_user = os.getenv("DB_USER")
    db_pass = os.getenv("DB_PASS")
    db_name = os.getenv("DB_NAME")

    if not (instance_connection_name or db_user or db_pass or db_name):
        print("No connection name or database credentials found, skipping.")
        return

    with Connector() as connector:

        def getconn() -> sqlalchemy.engine.base.Connection:
            conn = connector.connect(
                instance_connection_name,
                "pymysql",
                user=db_user,
                password=db_pass,
                db=db_name,
                ip_type="private",
            )
            return conn

        pool = sqlalchemy.create_engine(
            "mysql+pymysql://",
            creator=getconn,
        )

        try:
            with pool.connect() as db_conn:
                # Check if player names exist in the 'TeamDao' table
                query_teams = sqlalchemy.text("""
                    SELECT *
                    FROM TeamMatchDao
                    WHERE matchId LIKE 'final-%'
                """)
                result = db_conn.execute(query_teams)
                teams = set(row[0] for row in result)

                print(teams)
                print("Queried for teams")

        except Exception as e:
            print(f"Error while interacting with the database: {str(e)}")
            db_conn.rollback()


# T, idxs, matches = parse_matches(get_matches())
T, team_to_idxs, idxs_to_team, matches = parse_matches_csv(
    "./scripts/test/matches_test.csv"
)
mov = calculate_margin_of_victory(matches, T)
results = find_weighted_pnl(mov)

for pnl, idx in results:
    print(f"{idxs_to_team[idx]}:\t\t{pnl}")
