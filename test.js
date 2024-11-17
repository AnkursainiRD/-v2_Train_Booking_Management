import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 890,
  duration: '7s',
};

export default function() {
  http.get('http://localhost:4000/api/v1/user/allUser');
  sleep(1);
}
