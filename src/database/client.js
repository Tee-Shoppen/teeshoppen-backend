import { BigQuery } from "@google-cloud/bigquery";
const projectId = process.env.GOOGLE_PROJECT_ID;
const datasetId = process.env.BIGQUERY_DATASET_ID;
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

function getBigQueryClient() {
  return new BigQuery({
    projectId,
    keyFilename,
  });
}

function getDatasetRef() {
  return getBigQueryClient().dataset(datasetId);
}


export { getBigQueryClient, getDatasetRef };
