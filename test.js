import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 2000,
  duration: '20s',
};

export default function() {
  http.get('http://localhost:4000/api/v1/user/allUser');
  sleep(1);
}
