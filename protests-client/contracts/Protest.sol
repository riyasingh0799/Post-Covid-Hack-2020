pragma solidity ^0.5.0;


contract Protest {

    address owner;

    constructor() public{
      owner = msg.sender;
    }

    struct User {
        uint id;
        string encrypting_key;
        string verifying_key;
        bool access_allowed;
        string dataURL;
        string notifURL;
    }

    uint public totalUsers;
    
    mapping(uint => User) public usersMapping;

    string public protestDataIpfsUrl;

    function addUser(string memory _encrypting_key, string memory _verifying_key, string memory _dataURL) public returns(uint){
        User storage u = usersMapping[totalUsers];
        u.id = totalUsers;
        u.encrypting_key = _encrypting_key;
        u.verifying_key = _verifying_key;
        u.access_allowed = true;
        u.dataURL = _dataURL;
        totalUsers+=1;
        return u.id;
    }
    
    function addProtests(string memory _protestDataIpfsUrl) public {
      protestDataIpfsUrl = _protestDataIpfsUrl;
    }

    function getData(string memory _encrypting_key, uint _id) public returns (string memory) {
      require(usersMapping[_id].access_allowed == true, 
          "Access not granted."
        );
        
      return usersMapping[_id].dataURL;
    }
   
    function getProtestDataIpfsUrl() public returns (string memory) {
      return protestDataIpfsUrl;
    }

    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }

}