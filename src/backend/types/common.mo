import Time "mo:core/Time";

module {
  public type UserId = Nat;
  public type CowId = Nat;
  public type Timestamp = Time.Time;

  public type User = {
    id : UserId;
    name : Text;
    role : Text; // "admin" | "editor" | "viewer"
    pin : Text;
  };

  public type Cow = {
    id : CowId;
    name : Text;
    breed : Text;
    age : Nat;
    healthStatus : Text;
    description : Text;
    addedDate : Timestamp;
    tagNumber : Text;
    qrCode : Text;
  };

  public type Calf = {
    id : Nat;
    cowId : CowId;
    birthMonth : Nat;
    birthYear : Nat;
    gender : Text;
    tagNumber : Text;
    notes : Text;
    addedDate : Timestamp;
  };

  public type Donation = {
    id : Nat;
    donorName : Text;
    amount : Float;
    date : Timestamp;
    message : Text;
    purpose : Text;
  };

  public type HealthRecord = {
    id : Nat;
    cowId : CowId;
    date : Timestamp;
    notes : Text;
    status : Text;
    vetName : Text;
  };

  public type Announcement = {
    id : Nat;
    title : Text;
    titleHindi : Text;
    content : Text;
    contentHindi : Text;
    date : Timestamp;
    isActive : Bool;
  };

  public type ChangeLog = {
    id : Nat;
    userName : Text;
    action : Text;
    entity : Text;
    entityName : Text;
    details : Text;
    timestamp : Timestamp;
  };

  public type MilkRecord = {
    id : Nat;
    cowId : CowId;
    cowName : Text;
    date : Text;
    morning : Float;
    evening : Float;
    addedDate : Timestamp;
    changedBy : Text;
  };

  public type GaushaalaProfile = {
    name : Text;
    nameHindi : Text;
    description : Text;
    descriptionHindi : Text;
    phone : Text;
    address : Text;
    logoBase64 : Text;
  };

  public type FeedStock = {
    id : Nat;
    feedType : Text; // "wet" | "dry"
    totalStock : Float;
    dailyPerCow : Float;
    lastUpdated : Timestamp;
    updatedBy : Text;
  };

  public type FeedHistory = {
    id : Nat;
    feedType : Text;
    action : Text; // "add" | "consume"
    quantity : Float;
    notes : Text;
    date : Timestamp;
    recordedBy : Text;
  };
};
