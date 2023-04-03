import crypto from 'crypto'

/**
 * This function generates a deterministic partition key for a given event.
 * If the event has a partition key, that will be used as the candidate.
 * If not, the event data will be hashed using the sha3-512 algorithm and the hash value will be used as the candidate.
 * If the candidate is not a string, it will be converted to a string.
 * If the candidate's length is greater than the max partition key length, it will be hashed again using the sha3-512 algorithm.
 * If the candidate is still null, the trivial partition key (0) will be used.
 * @param {*} event The event object for which to generate the partition key.
 * @returns The partition key generated for the given event.
 */

const deterministicPartitionKey = (event) => {
    const TRIVIAL_PARTITION_KEY = "0";
    const MAX_PARTITION_KEY_LENGTH = 256;
    let candidate;

    if (event) {
        if (event.partitionKey) {
            candidate = event.partitionKey;
        } else {
            const data = JSON.stringify(event);
            candidate = crypto.createHash("sha3-512").update(data).digest("hex");
        }
    }

    if (candidate) {
        if (typeof candidate !== "string") {
            candidate = JSON.stringify(candidate);
        }
    } else {
        candidate = TRIVIAL_PARTITION_KEY;
    }
    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
        candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
    }
    return candidate;
};

export { deterministicPartitionKey };

