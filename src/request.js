import axios from 'axios';

const corsUrl = 'https://api.allorigins.win/get?url=';

export default (url) => axios.get(`${corsUrl}${encodeURIComponent(url)}`);
