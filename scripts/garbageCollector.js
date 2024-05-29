const { create } = require('ipfs-http-client');

const ipfs = create('http://localhost:5001'); // IPFS API endpoint

const runGarbageCollection = async () => {
    try {
        for await (const res of ipfs.repo.gc()) {
            console.log('Removed:', res.cid.toString());
        }
        console.log('Garbage collection completed.');
    } catch (err) {
        console.error('Error during garbage collection:', err);
    }
};

runGarbageCollection();
