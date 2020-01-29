import express          from 'express';
import { createServer } from 'http';
import cors             from 'cors';
import objToSpw         from 'spw-lang/util/objToSpw';
import socketIO         from 'socket.io';

const app  = express();
const http = createServer(app);
const io   = socketIO(http);

app.use(cors());

io.on(
    'connection',
    socket => {
        setInterval(
            () => {
                const spw =
                          objToSpw({
                              added: [
                                  { now: Date.now() },
                                  { filename: 'boon' },
                                  { filename: 'boon' }
                              ]
                          });
                socket.emit('content-changed', { label: `${spw}` });
            },

            1000
        );
    }
);
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});


app
    .get(
        '/api/concept/example',
        (req, res) => {
            res.send('hello[hello]');
        }
    );


http.listen(3050, '0.0.0.0', () => { console.log('listening on *:3050'); });
