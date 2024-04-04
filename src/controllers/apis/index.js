import axios from 'axios';
import axiosRetry from 'axios-retry';

class Apis {
  constructor(config) {
    this.api = axios.create(config);
    axiosRetry(this.api, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
  }
}

export default Apis;
