// deterministicPartitionKey.test.js
import { deterministicPartitionKey } from '../deterministicPartitionKey.js';
import crypto from 'crypto'

describe("deterministicPartitionKey", () => {
    test('deterministicPartitionKey returns expected output', () => {
        const event = { foo: 'bar' };
        const result = deterministicPartitionKey(event);
        expect(typeof result).toBe('string');
    });

    test("should return trivial partition key when event is not defined", () => {
        expect(deterministicPartitionKey()).toEqual("0");
    });

    test("should return trivial partition key when event is null", () => {
        expect(deterministicPartitionKey(null)).toEqual("0");
    });

    test("should return trivial partition key when event is undefined", () => {
        expect(deterministicPartitionKey(undefined)).toEqual("0");
    });

    test("should return trivial partition key when event is an empty object", () => {
        const event = {};
        const result = deterministicPartitionKey(event);
        const expected = crypto.createHash("sha3-512").update(JSON.stringify({})).digest("hex");
        expect(result).toEqual(expected);
    });

    test("should return partition key when it is defined in event", () => {
        const event = { partitionKey: "test-key" };
        expect(deterministicPartitionKey(event)).toEqual("test-key");
    });

    test("should return partition key when it is a string in event", () => {
        const event = { partitionKey: "test-key" };
        expect(deterministicPartitionKey(event)).toEqual("test-key");
    });

    test("should return partition key when it is a number in event", () => {
        const event = { partitionKey: 123 };
        expect(deterministicPartitionKey(event)).toEqual("123");
    });

    test("should return partition key when it is an array in event", () => {
        const event = { partitionKey: [1, 2, 3] };
        expect(deterministicPartitionKey(event)).toEqual("[1,2,3]");
    });

    test("should return partition key when it is a boolean in event", () => {
        const event = { partitionKey: true };
        expect(deterministicPartitionKey(event)).toEqual("true");
    });

    test("should return partition key when it is an object in event", () => {
        const event = { partitionKey: { foo: "bar" } };
        expect(deterministicPartitionKey(event)).toEqual('{"foo":"bar"}');
    });

    test("should hash partition key when it is longer than max length", () => {
        const partitionKey = "x".repeat(257);
        const expectedHash = crypto.createHash("sha3-512").update(partitionKey).digest("hex");
        expect(deterministicPartitionKey({ partitionKey })).toEqual(expectedHash);
    });
});

