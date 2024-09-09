// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PropertyRegistry {
    struct Property {
        address owner;
        uint256 propId;
        string name;
        string category;
        string location;
        string area;
        string description;
        string image;
        uint256 price;
    }

    // MAPPING
    mapping(uint256 => Property) private propertyRecords;

    uint256 public numberOfProperties;

    // Struct to store the details of the last transfer for a property
    struct LastTransfer {
        address previousOwner;
        address newOwner;
        uint256 transferTime;
    }
    // Mapping to store the last transfer information for each property
    mapping(uint256 => LastTransfer) private lastTransfers;

    // EVENTS
    event PropertyRegistered(
        uint256 indexed propId,
        address indexed owner,
        string location,
        string area,
        uint256 price
    );
    event PriceChanged(uint256 indexed propId, uint256 price);
    event PropertyOwnershipTransferred(
        uint256 indexed propId,
        uint256 price,
        address indexed previousOwner,
        address indexed newOwner
    );

    // ADDING A NEW PROPERTY
    function registerProperty(
        address owner,
        string memory _propName,
        string memory _category,
        string memory _location,
        string memory _area,
        string memory _description,
        string memory _image,
        uint256 price
    )
        external
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        // Checking if the owner's address is not zero
        require(owner != address(0), "Owner address cannot be 0");
        // A price is required to be entered
        require(price > 0, "Price must be greater then 0!");
        numberOfProperties++;
        uint256 propertyId = numberOfProperties;
        Property storage property = propertyRecords[propertyId];

        property.propId = propertyId;
        property.owner = owner;
        property.name = _propName;
        property.category = _category;
        property.location = _location;
        property.area = _area;
        property.description = _description;
        property.price = price;
        property.image = _image;

        emit PropertyRegistered(propertyId, owner, _location, _area, price);
        return (propertyId, _propName, _category, _description, _image);
    }

    // CHANGING PROPERTY DETAILS
    function modifyDetails(
        address owner,
        uint256 propertyId,
        string memory _propName,
        string memory _category,
        string memory _location,
        string memory _description,
        string memory _image
    ) external returns (string memory) {
        Property storage property = propertyRecords[propertyId];
        //  Checking if the caller of the function is the owner
        require(property.owner == owner, "You are not the owner");

        property.name = _propName;
        property.category = _category;
        property.location = _location;
        property.description = _description;
        property.image = _image;

        return "Property details updated successfully";
    }

    function changePrice(
        address owner,
        uint256 propertyId,
        uint256 price
    ) external returns (string memory) {
        require(price > 0, "Price must be greater than 0!");
        Property storage property = propertyRecords[propertyId];
        require(property.owner == owner, "You are not the owner!");

        property.price = price;

        emit PriceChanged(propertyId, price);

        return "Property price updated successfully!";
    }

    // PURCHASING A PROPERTY
    function purchaseProperty(
        address purchaser,
        uint256 propertyId
    ) external payable {
        // Checking that the buyer is not the owner of the property.
        require(
            purchaser != propertyRecords[propertyId].owner,
            "You cannot buy your own property"
        );
        uint256 total = msg.value;

        require(total >= propertyRecords[propertyId].price, "Not enough funds");
        Property storage property = propertyRecords[propertyId];

        uint256 requiredAmount = propertyRecords[propertyId].price;
        uint256 change = total - requiredAmount;
        // Capture the current owner's address before transferring ownership
        address previousOwner = property.owner;

        (bool sent, ) = payable(property.owner).call{value: requiredAmount}("");
        require(sent, "Failed to send Ether");

        property.owner = purchaser;
        emit PropertyOwnershipTransferred(
            propertyId,
            requiredAmount,
            previousOwner,
            purchaser
        );

        // Returning remaining funds to the purchaser who bought the property
        if (change > 0) {
            payable(purchaser).transfer(change);
        }

        lastTransfers[propertyId] = LastTransfer({
            previousOwner: previousOwner,
            newOwner: purchaser,
            transferTime: block.timestamp
        });
    }

    // RETRIEVES AN ARRAY OF ALL EXISTING OBJECTS
    function listAllProperties() public view returns (Property[] memory) {
        Property[] memory properties = new Property[](numberOfProperties);
        uint256 currentPropertyIndex = 0;
        for (uint256 i = 0; i < numberOfProperties; i++) {
            Property storage currentProperty = propertyRecords[i + 1];
            // Checks if the property exists
            if (currentProperty.owner != address(0)) {
                properties[currentPropertyIndex] = currentProperty;
                currentPropertyIndex += 1;
            }
        }
        return properties;
    }

    // RETRIEVES DETAILS OF AN INDIVIDUAL PROPERTY
    function getPropertyDetails(
        uint256 propertyId
    )
        external
        view
        returns (
            address,
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        Property memory property = propertyRecords[propertyId];
        return (
            property.owner,
            property.propId,
            property.name,
            property.category,
            property.location,
            property.area,
            property.description,
            property.image,
            property.price
        );
    }

    // RETRIEVES A LIST OF PROPERTIES OWNED BY A SPECIFIC OWNER
    function listPropertiesByOwner(
        address owner
    ) external view returns (Property[] memory) {
        uint256 totalPropertyCount = numberOfProperties;
        uint256 propertyCount = 0;

        // Counts the number of properties owned by a specific owner
        for (uint256 i = 0; i < totalPropertyCount; i++) {
            if (propertyRecords[i + 1].owner == owner) {
                propertyCount += 1;
            }
        }

        // Initializes an array with the correct size
        Property[] memory properties = new Property[](propertyCount);

        // Adds properties to the array
        uint256 currentPropertyIndex = 0;
        for (uint256 i = 0; i < totalPropertyCount; i++) {
            if (propertyRecords[i + 1].owner == owner) {
                Property storage currentProperty = propertyRecords[i + 1];
                properties[currentPropertyIndex] = currentProperty;
                currentPropertyIndex += 1;
            }
        }

        return properties;
    }

    // FUNCTION TO RETRIEVE THE DETAILS OF THE MOST RECENT TRANSFER FOR A SPECIFIED PROPERTY
    function getLastTransfer(
        uint256 propertyId
    ) external view returns (LastTransfer memory) {
        return lastTransfers[propertyId];
    }
}
