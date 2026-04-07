import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";

module {
  type Cow = {
    id : Nat;
    name : Text;
    breed : Text;
    age : Nat;
    healthStatus : Text;
    description : Text;
    addedDate : Time.Time;
    tagNumber : Text;
    qrCode : Text;
  };

  type Calf = {
    id : Nat;
    cowId : Nat;
    birthMonth : Nat;
    birthYear : Nat;
    gender : Text;
    tagNumber : Text;
    notes : Text;
    addedDate : Time.Time;
  };

  type Donation = {
    id : Nat;
    donorName : Text;
    amount : Float;
    date : Time.Time;
    message : Text;
    purpose : Text;
  };

  type HealthRecord = {
    id : Nat;
    cowId : Nat;
    date : Time.Time;
    notes : Text;
    status : Text;
    vetName : Text;
  };

  type Announcement = {
    id : Nat;
    title : Text;
    titleHindi : Text;
    content : Text;
    contentHindi : Text;
    date : Time.Time;
    isActive : Bool;
  };

  type User = {
    id : Nat;
    name : Text;
    role : Text;
    pin : Text;
  };

  type ChangeLog = {
    id : Nat;
    userName : Text;
    action : Text;
    entity : Text;
    entityName : Text;
    details : Text;
    timestamp : Time.Time;
  };

  type MilkRecord = {
    id : Nat;
    cowId : Nat;
    cowName : Text;
    date : Text;
    morning : Float;
    evening : Float;
    addedDate : Time.Time;
    changedBy : Text;
  };

  type GaushaalaProfile = {
    name : Text;
    nameHindi : Text;
    description : Text;
    descriptionHindi : Text;
    phone : Text;
    address : Text;
    logoBase64 : Text;
  };

  type FeedStock = {
    id : Nat;
    feedType : Text;
    totalStock : Float;
    dailyPerCow : Float;
    lastUpdated : Time.Time;
    updatedBy : Text;
  };

  type FeedHistory = {
    id : Nat;
    feedType : Text;
    action : Text;
    quantity : Float;
    notes : Text;
    date : Time.Time;
    recordedBy : Text;
  };

  type OldActor = {
    cows : Map.Map<Nat, Cow>;
    calves : Map.Map<Nat, Calf>;
    donations : Map.Map<Nat, Donation>;
    healthRecords : Map.Map<Nat, HealthRecord>;
    announcements : Map.Map<Nat, Announcement>;
    users : Map.Map<Nat, User>;
    changeLogs : Map.Map<Nat, ChangeLog>;
    milkRecords : Map.Map<Nat, MilkRecord>;
    userHeartbeats : Map.Map<Nat, Time.Time>;
    feedStocks : Map.Map<Nat, FeedStock>;
    feedHistories : Map.Map<Nat, FeedHistory>;
    cowIdCounter : Nat;
    calfIdCounter : Nat;
    donationIdCounter : Nat;
    healthRecordIdCounter : Nat;
    announcementIdCounter : Nat;
    userIdCounter : Nat;
    changeLogIdCounter : Nat;
    milkRecordIdCounter : Nat;
    feedStockIdCounter : Nat;
    feedHistoryIdCounter : Nat;
    gaushaalaProfile : GaushaalaProfile;
  };

  type NewActor = {
    cowsArr : [Cow];
    calvesArr : [Calf];
    donationsArr : [Donation];
    healthRecordsArr : [HealthRecord];
    announcementsArr : [Announcement];
    usersArr : [User];
    changeLogsArr : [ChangeLog];
    milkRecordsArr : [MilkRecord];
    userHeartbeatsArr : [(Nat, Time.Time)];
    feedStocksArr : [FeedStock];
    feedHistoriesArr : [FeedHistory];
    cowIdCounter : Nat;
    calfIdCounter : Nat;
    donationIdCounter : Nat;
    healthRecordIdCounter : Nat;
    announcementIdCounter : Nat;
    userIdCounter : Nat;
    changeLogIdCounter : Nat;
    milkRecordIdCounter : Nat;
    feedStockIdCounter : Nat;
    feedHistoryIdCounter : Nat;
    gaushaalaProfile : GaushaalaProfile;
  };

  public func run(old : OldActor) : NewActor {
    let cowsArray = old.cows.entries().map(func((_, cow)) { cow }).toArray();
    let calvesArray = old.calves.entries().map(func((_, calf)) { calf }).toArray();
    let donationsArray = old.donations.entries().map(func((_, donation)) { donation }).toArray();
    let healthRecordsArray = old.healthRecords.entries().map(func((_, healthRecord)) { healthRecord }).toArray();
    let announcementsArray = old.announcements.entries().map(func((_, announcement)) { announcement }).toArray();
    let usersArray = old.users.entries().map(func((_, user)) { user }).toArray();
    let changeLogsArray = old.changeLogs.entries().map(func((_, changeLog)) { changeLog }).toArray();
    let milkRecordsArray = old.milkRecords.entries().map(func((_, milkRecord)) { milkRecord }).toArray();
    let feedStocksArray = old.feedStocks.entries().map(func((_, feedStock)) { feedStock }).toArray();
    let feedHistoriesArray = old.feedHistories.entries().map(func((_, feedHistory)) { feedHistory }).toArray();
    let userHeartbeatsArray = old.userHeartbeats.entries().toArray();

    {
      cowsArr = cowsArray;
      calvesArr = calvesArray;
      donationsArr = donationsArray;
      healthRecordsArr = healthRecordsArray;
      announcementsArr = announcementsArray;
      usersArr = usersArray;
      changeLogsArr = changeLogsArray;
      milkRecordsArr = milkRecordsArray;
      userHeartbeatsArr = userHeartbeatsArray;
      feedStocksArr = feedStocksArray;
      feedHistoriesArr = feedHistoriesArray;
      cowIdCounter = old.cowIdCounter;
      calfIdCounter = old.calfIdCounter;
      donationIdCounter = old.donationIdCounter;
      healthRecordIdCounter = old.healthRecordIdCounter;
      announcementIdCounter = old.announcementIdCounter;
      userIdCounter = old.userIdCounter;
      changeLogIdCounter = old.changeLogIdCounter;
      milkRecordIdCounter = old.milkRecordIdCounter;
      feedStockIdCounter = old.feedStockIdCounter;
      feedHistoryIdCounter = old.feedHistoryIdCounter;
      gaushaalaProfile = old.gaushaalaProfile;
    };
  };
};
