## Execution Guide

Follow the steps below to run the script.

### 1. Navigate to the Script Directory

Open a terminal and move to the directory where the script is located.

```bash
cd <path-to-script-directory>
```

### 2. Ensure Environment Variables Are Configured

Make sure a `.env` file exists at the project root and contains the MongoDB connection string.

Example:

```
MONGODB_URL=<mongodb-url>
```

### 3. Execute the Script

Run the script using Node.js.

```bash
node <script-file-name>.js
```

### 4. Verify Execution

While running, the script will log:

* Database connection confirmation
* Number of roles processed
* Skipped roles (already lowercase or duplicates)
* Updated role codes

Once finished, the console will display:

```
Script completed successfully
```
