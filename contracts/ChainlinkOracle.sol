// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

abstract contract Context {
    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; 
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface AggregatorV3Interface {
  function decimals() external view returns (uint8);

  function description() external view returns (string memory);

  function version() external view returns (uint256);

  function getRoundData(uint80 _roundId)
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    );

  function latestRoundData()
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    );
}

contract ChainlinkOracle is Ownable, IERC165 {
  AggregatorV3Interface internal aggregatorContract;

  bytes4 private constant _INTERFACE_ID_CHAINLINK_ORACLE = 0x85be402b;

  bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

  constructor(address _aggregator) {
    aggregatorContract = AggregatorV3Interface(_aggregator);
  }

  function setReferenceContract(address _aggregator) public onlyOwner() {
    aggregatorContract = AggregatorV3Interface(_aggregator);
  }

  function getLatestAnswer() public view returns (int256) {
    (
      uint80 roundID,
      int256 price,
      ,
      uint256 timeStamp,
      uint80 answeredInRound
    ) = aggregatorContract.latestRoundData();
    require(
      timeStamp != 0,
      "ChainlinkOracle::getLatestAnswer: round is not complete"
    );
    require(
      answeredInRound >= roundID,
      "ChainlinkOracle::getLatestAnswer: stale data"
    );
    return price;
  }

  function getLatestRound()
    public
    view
    returns (
      uint80,
      int256,
      uint256,
      uint256,
      uint80
    )
  {
    (
      uint80 roundID,
      int256 price,
      uint256 startedAt,
      uint256 timeStamp,
      uint80 answeredInRound
    ) = aggregatorContract.latestRoundData();

    return (roundID, price, startedAt, timeStamp, answeredInRound);
  }

  function getRound(uint80 _id)
    public
    view
    returns (
      uint80,
      int256,
      uint256,
      uint256,
      uint80
    )
  {
    (
      uint80 roundID,
      int256 price,
      uint256 startedAt,
      uint256 timeStamp,
      uint80 answeredInRound
    ) = aggregatorContract.getRoundData(_id);

    return (roundID, price, startedAt, timeStamp, answeredInRound);
  }

  function getLatestTimestamp() public view returns (uint256) {
    (, , , uint256 timeStamp, ) = aggregatorContract.latestRoundData();
    return timeStamp;
  }

  function getPreviousAnswer(uint80 _id) public view returns (int256) {
    (uint80 roundID, int256 price, , , ) = aggregatorContract.getRoundData(_id);
    require(
      _id <= roundID,
      "ChainlinkOracle::getPreviousAnswer: not enough history"
    );
    return price;
  }

  function getPreviousTimestamp(uint80 _id) public view returns (uint256) {
    (uint80 roundID, , , uint256 timeStamp, ) =
      aggregatorContract.getRoundData(_id);
    require(
      _id <= roundID,
      "ChainlinkOracle::getPreviousTimestamp: not enough history"
    );
    return timeStamp;
  }

  function supportsInterface(bytes4 interfaceId)
    external
    pure
    override
    returns (bool)
  {
    return (interfaceId == _INTERFACE_ID_CHAINLINK_ORACLE ||
      interfaceId == _INTERFACE_ID_ERC165);
  }
}
