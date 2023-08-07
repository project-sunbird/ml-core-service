// Import the required module
const cloudService = require('client-cloud-services');

/**
 * Function to initialize the cloud client with the provided configuration.
 * If any error occurs during initialization, it will be logged, and the process will exit.
 */
function initializeCloudClient() {
  try {
    // Cloud configuration containing credentials and container names
    let cloudConfig = {
      provider: process.env.SUNBIRD_CLOUD_STORAGE_PROVIDER,
      identity: process.env.CLOUD_PRIVATE_STORAGE_ACCOUNTNAME,
      credential: process.env.CLOUD_PRIVATE_STORAGE_SECRET,
      reportsContainer: process.env.CLOUD_STORAGE_PRIVATEREPORTS_BUCKETNAME,
      labelsContainer: process.env.CLOUD_STORAGE_RESOURCEBUNDLE_BUCKETNAME,
      region: process.env.CLOUD_PRIVATE_STORAGE_REGION || null,
      projectId: process.env.CLOUD_PRIVATE_STORAGE_PROJECT || null,
      endpoint: process.env.CLOUD_PRIVATE_ENDPOINT || null
    };

    // Initialize the cloud client using the provided configuration
    let cloudClient = cloudService.init(cloudConfig);

    // Export the cloudClient so that it can be used in other modules
    exports.cloudClient = cloudClient;
  } catch (error) {
    // If any error occurs during initialization, log the error and exit the process
    console.error('Error occurred during cloud client initialization:', error.message);
    process.exit();
  }
}

// Call the function to initialize the cloud client
initializeCloudClient();
