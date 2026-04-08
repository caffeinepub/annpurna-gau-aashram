import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

mixin (
  feedStocks : List.List<Types.FeedStock>,
  feedHistories : List.List<Types.FeedHistory>,
  feedHistoryIdCounter : Nat,
  changeLogs : List.List<Types.ChangeLog>,
  changeLogIdCounter : Nat,
) {
  public shared ({ caller }) func updateFeedStock(
    feedType : Text,
    totalStock : Float,
    dailyPerCow : Float,
    updatedBy : Text,
  ) : async () {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func addFeedStockQuantity(
    feedType : Text,
    quantity : Float,
    notes : Text,
    recordedBy : Text,
  ) : async () {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func recordFeedConsumption(
    feedType : Text,
    quantity : Float,
    notes : Text,
    recordedBy : Text,
  ) : async () {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getFeedStocks() : async [Types.FeedStock] {
    Runtime.trap("not implemented");
  };

  public query ({ caller }) func getFeedHistory() : async [Types.FeedHistory] {
    Runtime.trap("not implemented");
  };
};
