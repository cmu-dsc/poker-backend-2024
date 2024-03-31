import { exec } from 'child_process'
import { writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function logCurrentServiceAccount() {
  try {
    const { stdout } = await execAsync('gcloud config get-value account')
    const lines = stdout.split('\n').filter(line => line.trim() !== '')
    const accountEmail = lines[lines.length - 1].trim()
    console.log(`Current service account: ${accountEmail}`)
  } catch (error) {
    console.error('Error fetching current service account:', error)
  }
}

async function createServiceAccount(
  projectId: string,
  serviceAccountId: string,
  displayName: string,
) {
  const command = `gcloud iam service-accounts create ${serviceAccountId} --project=${projectId} --display-name="${displayName}"`
  await execAsync(command)
  console.log(`Created service account: ${serviceAccountId}`)
}

async function bindGitHubRepoToServiceAccount(
  projectId: string,
  serviceAccountEmail: string,
  githubRepoRef: string,
  workloadIdentityPoolId: string,
) {
  const command = `gcloud iam service-accounts add-iam-policy-binding "${serviceAccountEmail}" --project="${projectId}" --role="roles/iam.workloadIdentityUser" --member="principalSet://iam.googleapis.com/${workloadIdentityPoolId}/attribute.repository/${githubRepoRef}"`
  await execAsync(command)
  console.log(
    `Bound GitHub repository ${githubRepoRef} to service account ${serviceAccountEmail}`,
  )
}

async function createArtifactRegistryRepo(
  projectId: string,
  location: string,
  repositoryId: string,
) {
  const createCommand = `gcloud artifacts repositories create ${repositoryId} --project=${projectId} --location=${location} --repository-format=docker`
  await execAsync(createCommand)
  console.log(`Created Artifact Registry repository: ${repositoryId}`)

  const policyContent = [
    {
      name: 'delete-untagged-artifacts',
      action: {
        type: 'Delete',
      },
      condition: {
        tagState: 'untagged',
      },
    },
  ]

  const tempDir = tmpdir()
  const policyFile = join(tempDir, 'cleanup_policy.json')

  await writeFile(policyFile, JSON.stringify(policyContent, null, 2))

  const setPolicyCommand = `gcloud artifacts repositories set-cleanup-policies ${repositoryId} --project=${projectId} --location=${location} --policy=${policyFile}`
  await execAsync(setPolicyCommand)
  console.log(`Set cleanup policy for repository: ${repositoryId}`)
}

async function grantArtifactRegistryWriterRole(
  projectId: string,
  location: string,
  repositoryId: string,
  serviceAccountEmail: string,
) {
  const command = `gcloud artifacts repositories add-iam-policy-binding ${repositoryId} --project=${projectId} --location=${location} --member="serviceAccount:${serviceAccountEmail}" --role="roles/artifactregistry.writer"`
  await execAsync(command)
  console.log(
    `Granted Artifact Registry Writer role to ${serviceAccountEmail} for repository ${repositoryId}`,
  )
}

async function createServiceAccountAndResources(githubUsername: string) {
  const username = githubUsername.toLowerCase().replace(/[^a-z0-9-]/g, '')
  const projectId = 'pokerai-417521'
  const serviceAccountId = username
  const displayName = username
  const serviceAccountEmail = `${username}@${projectId}.iam.gserviceaccount.com`
  const githubRepoRef = `${githubUsername}/poker-engine-2024`
  const workloadIdentityPoolId =
    'projects/979321260256/locations/global/workloadIdentityPools/github'
  const location = 'us-east4'
  const repositoryId = username

  try {
    await logCurrentServiceAccount()
    // Step 1: Create a service account
    await createServiceAccount(projectId, serviceAccountId, displayName)

    // Step 2: Bind the GitHub repository to the service account
    await bindGitHubRepoToServiceAccount(
      projectId,
      serviceAccountEmail,
      githubRepoRef,
      workloadIdentityPoolId,
    )

    // Step 3: Create an Artifact Registry repository
    await createArtifactRegistryRepo(projectId, location, repositoryId)

    // Step 4: Grant the Artifact Registry Writer role to the service account for the specific repository
    await grantArtifactRegistryWriterRole(
      projectId,
      location,
      repositoryId,
      serviceAccountEmail,
    )

    console.log('Service account and resources setup completed successfully.')
  } catch (error) {
    console.error('Error setting up the service account and resources:', error)
  }
}

export default createServiceAccountAndResources
