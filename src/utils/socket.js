import io from 'socket.io-client';
import {constant} from '../constant';
const socket = io("ws://"+constant.sockethost);
export default socket;