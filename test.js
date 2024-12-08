import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 290,
  duration: '7s',
};

export default function() {
  http.get('http://localhost:3000/api/v1/user/allUser');
  sleep(1);
}
