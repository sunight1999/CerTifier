/*
 * Modules
 */
// Electron
const { app, BrowserWindow, Menu, Tray } = require('electron');
const { Notification } = require("electron");
const path = require('path');

// Gmail
const fs = require('fs').promises;
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { PubSub } = require('@google-cloud/pubsub');
const { Storage } = require('@google-cloud/storage');
const { google } = require('googleapis');

const pubsub = new PubSub();
const storage = new Storage({ keyFilename: 'credentials.json' });

const bucketName = 'certifier-client-bucket';
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const CONFIG_PATH = path.join(process.cwd(), 'config.json');

/*
 * Start Tray Service
 */
let tray = null;
app.whenReady().then(() => {
    tray = new Tray('./img/TrayIconTemplate.png');
    const contextMenu = Menu.buildFromTemplate([
        { label: 'About CerTifier', role: 'help' },
        { type: "separator" },
        { label: 'Close', role: 'close', click: close },
    ]);
    tray.setToolTip('CerTifier');

    // Make a change to the context menu
    contextMenu.items[1].checked = false;

    // Call this again for Linux because we modified the context menu
    tray.setContextMenu(contextMenu);
});

let config;
async function loadConfiguration(){
    try {
        const raw = await fs.readFile(CONFIG_PATH);
        config = JSON.parse(raw);
    } catch (err) {
        config = {
            from: 'cyber@mjc.ac.kr'
        };
    }
}
loadConfiguration();

/*
 * Start Main Services
 */

// Notification
function showNotification(body) {
    var noti = new Notification({ title: '명지전문대학교 2차 인증 코드', body: body });
    noti.show();
    setTimeout(() => { if (noti) noti.close() }, 3000);
}

// Gmail
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
* Serializes credentials to a file compatible with GoogleAUth.fromJSON.
*
* @param {OAuth2Client} client
* @return {Promise<void>}
*/
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.labels.list({
        userId: 'me',
    });
    const labels = res.data.labels;
    if (!labels || labels.length === 0) {
        console.log('No labels found.');
        return;
    }
    console.log('Labels:');
    labels.forEach((label) => {
        console.log(`- ${label.name}`);
    });
}

async function gmailWatch(auth) {
    let gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.watch({
        userId: 'me',
        requestBody: {
            'labelIds': ['INBOX'], //UNREAD
            'topicName': 'projects/certif-383716/topics/newMail'
        }
    }).catch(err => {
        console.log(err.message);
    })
}

let mid = null;
async function gmailService(auth) {
    gmailWatch(auth);

    const topic = pubsub.topic('projects/certif-383716/topics/newMail');
    const sub = topic.subscription('newMail-sub');

    let messageCount = 0;
    const messageHandler = message => {
        console.log('Received message ' + message.id);
        console.log('\tData ' + message.data);
        
        mid = message.id + '';
        message.ack();

        google.gmail({ version: 'v1', auth }).users.messages.list({
            auth: auth,
            userId: 'me',
            maxResults: 1,
            q: "from:" + config.from,
            labelIds: ['INBOX', 'UNREAD']
        }, (err, res) => {
            notifyCode(auth, res.data.messages);
        });
    }

    sub.on('message', messageHandler);

    console.log('Service is ready.');
}

let prevId = null;
function notifyCode(auth, data) {
    let gmail = google.gmail({ version: 'v1', auth });

    if (prevId === data[0].id)
        return;

    gmail.users.messages.get({
        auth: auth,
        userId: 'me',
        id: data[0].id
    }, (err, res) => {
        if (err)
            console.log(err);
        
        var snippet = res.data.snippet.split(' ');
        snippet = snippet[snippet.length - 1];

        showNotification(snippet);

        prevId = data[0].id;
        console.log(prevId);
    });
}

async function createBucket() {
    // Creates the new bucket
    const res = await storage.getBuckets();
    const [buckets] = res;
    
    let exists = false;
    buckets.forEach(bucket => {
        if (bucket.name === bucketName)
            exists = true;
    });
    
    if (!exists){
        await storage.createBucket(bucketName);
        console.log('Bucket ${bucketName} created.');
    }
}

createBucket().catch(console.error);

authorize().then(gmailService).catch(console.error);

/*
 * Event Handlers
 */
function close(item, window, event) {
    app.quit();
}

/*
 * Register Listeners
 */
app.on('before-quit', () => {
    if (tray !== null) tray.destroy();
    google.gmail.close
})

// Icon made by berkahicon from www.flaticon.com Freepik