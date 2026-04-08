import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

module {
  public func updateFeedStock(
    stocks : List.List<Types.FeedStock>,
    feedType : Text,
    totalStock : Float,
    dailyPerCow : Float,
    updatedBy : Text,
  ) {
    Runtime.trap("not implemented");
  };

  public func addFeedStockQuantity(
    stocks : List.List<Types.FeedStock>,
    histories : List.List<Types.FeedHistory>,
    feedHistoryIdCounter : Nat,
    feedType : Text,
    quantity : Float,
    notes : Text,
    recordedBy : Text,
  ) {
    Runtime.trap("not implemented");
  };

  public func recordFeedConsumption(
    stocks : List.List<Types.FeedStock>,
    histories : List.List<Types.FeedHistory>,
    feedHistoryIdCounter : Nat,
    feedType : Text,
    quantity : Float,
    notes : Text,
    recordedBy : Text,
  ) {
    Runtime.trap("not implemented");
  };

  public func getFeedStocks(stocks : List.List<Types.FeedStock>) : [Types.FeedStock] {
    Runtime.trap("not implemented");
  };

  public func getFeedHistory(histories : List.List<Types.FeedHistory>) : [Types.FeedHistory] {
    Runtime.trap("not implemented");
  };
};
