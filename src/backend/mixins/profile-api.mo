import Runtime "mo:core/Runtime";
import Types "../types/common";
import List "mo:core/List";

mixin (
  profile : Types.GaushaalaProfile,
  changeLogs : List.List<Types.ChangeLog>,
  changeLogIdCounter : Nat,
) {
  public query ({ caller }) func getProfile() : async Types.GaushaalaProfile {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func updateProfile(
    name : Text,
    nameHindi : Text,
    description : Text,
    descriptionHindi : Text,
    phone : Text,
    address : Text,
    logoBase64 : Text,
    changedBy : Text,
  ) : async () {
    Runtime.trap("not implemented");
  };
};
