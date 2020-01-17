import express          from 'express';
import { createServer } from 'http';
import cors             from 'cors';
import objToSpw         from 'spw-lang/util/objToSpw';

const app  = express();
const http = createServer(app);
const io   = require('socket.io')(http);

app.use(cors());

let age          = 22
const getConcept = () => ({ label: `[sam => {age=> ${age++}]` });

io.on('connection', socket => {
    console.log('a user connected');
    setInterval(
        () => {
            const spw = objToSpw(
                {
                    added: [
                        { now: Date.now() },
                        { filename: 'boon' },
                        { filename: 'boon' }
                    ]
                }
            );
            console.log(spw.toString())
            socket.emit(
                'content-changed',
                {
                    label: '' + spw
                }
            )
        }, 1000);
});
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});


app
    .get('/api/concept/example',
         (req, res) => {
             res.send(getConcept());
         });


http.listen(3050, '0.0.0.0', () => { console.log('listening on *:3050'); });
