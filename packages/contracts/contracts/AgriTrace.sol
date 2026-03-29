// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgriTrace
 * @notice Records harvest and shipment hashes on-chain for immutable traceability.
 *         Each harvest gets a unique QR code; the full record is hashed off-chain
 *         and the hash is stored here so buyers can verify data integrity.
 */
contract AgriTrace {

    struct HarvestRecord {
        bytes32 dataHash;    // keccak256 of (qrCode + cropType + quantityKg + farmerId + harvestDate)
        address recorder;    // wallet that submitted the record
        uint256 timestamp;   // block timestamp
        bool exists;
    }

    struct ShipmentRecord {
        bytes32 dataHash;    // keccak256 of (harvestQrCode + origin + destination + quantityKg)
        address recorder;
        uint256 timestamp;
        bool exists;
    }

    // qrCode => HarvestRecord
    mapping(string => HarvestRecord) private _harvests;

    // shipmentId => ShipmentRecord
    mapping(string => ShipmentRecord) private _shipments;

    address public owner;

    event HarvestRecorded(
        string indexed qrCode,
        bytes32 dataHash,
        address indexed recorder,
        uint256 timestamp
    );

    event ShipmentRecorded(
        string indexed shipmentId,
        bytes32 dataHash,
        address indexed recorder,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "AgriTrace: not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Record a harvest on-chain.
     * @param qrCode  The unique QR/trace ID (e.g. "AGT-1774819372684")
     * @param dataHash keccak256 hash of the harvest data computed off-chain
     */
    function recordHarvest(string calldata qrCode, bytes32 dataHash) external {
        require(bytes(qrCode).length > 0, "AgriTrace: empty qrCode");
        require(!_harvests[qrCode].exists, "AgriTrace: harvest already recorded");

        _harvests[qrCode] = HarvestRecord({
            dataHash: dataHash,
            recorder: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit HarvestRecorded(qrCode, dataHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Record a shipment on-chain.
     * @param shipmentId Unique shipment identifier
     * @param dataHash   keccak256 hash of the shipment data computed off-chain
     */
    function recordShipment(string calldata shipmentId, bytes32 dataHash) external {
        require(bytes(shipmentId).length > 0, "AgriTrace: empty shipmentId");
        require(!_shipments[shipmentId].exists, "AgriTrace: shipment already recorded");

        _shipments[shipmentId] = ShipmentRecord({
            dataHash: dataHash,
            recorder: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit ShipmentRecorded(shipmentId, dataHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Look up a harvest record. Returns zeros if not found.
     */
    function getHarvest(string calldata qrCode)
        external view
        returns (bytes32 dataHash, address recorder, uint256 timestamp, bool exists)
    {
        HarvestRecord storage r = _harvests[qrCode];
        return (r.dataHash, r.recorder, r.timestamp, r.exists);
    }

    /**
     * @notice Look up a shipment record. Returns zeros if not found.
     */
    function getShipment(string calldata shipmentId)
        external view
        returns (bytes32 dataHash, address recorder, uint256 timestamp, bool exists)
    {
        ShipmentRecord storage r = _shipments[shipmentId];
        return (r.dataHash, r.recorder, r.timestamp, r.exists);
    }

    /**
     * @notice Verify a harvest: returns true if the provided data matches the stored hash.
     */
    function verifyHarvest(string calldata qrCode, bytes32 dataHash)
        external view
        returns (bool)
    {
        return _harvests[qrCode].exists && _harvests[qrCode].dataHash == dataHash;
    }
}
