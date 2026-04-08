import List "mo:core/List";
import Time "mo:core/Time";
import Types "types/common";

module {
  // Old types — matching the stable var arrays from the previous actor version
  type OldCow = {
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

  type OldCalf = {
    id : Nat;
    cowId : Nat;
    birthMonth : Nat;
    birthYear : Nat;
    gender : Text;
    tagNumber : Text;
    notes : Text;
    addedDate : Time.Time;
  };

  type OldDonation = {
    id : Nat;
    donorName : Text;
    amount : Float;
    date : Time.Time;
    message : Text;
    purpose : Text;
  };

  type OldHealthRecord = {
    id : Nat;
    cowId : Nat;
    date : Time.Time;
    notes : Text;
    status : Text;
    vetName : Text;
  };

  type OldAnnouncement = {
    id : Nat;
    title : Text;
    titleHindi : Text;
    content : Text;
    contentHindi : Text;
    date : Time.Time;
    isActive : Bool;
  };

  type OldUser = {
    id : Nat;
    name : Text;
    role : Text;
    pin : Text;
  };

  type OldChangeLog = {
    id : Nat;
    userName : Text;
    action : Text;
    entity : Text;
    entityName : Text;
    details : Text;
    timestamp : Time.Time;
  };

  type OldMilkRecord = {
    id : Nat;
    cowId : Nat;
    cowName : Text;
    date : Text;
    morning : Float;
    evening : Float;
    addedDate : Time.Time;
    changedBy : Text;
  };

  type OldGaushaalaProfile = {
    name : Text;
    nameHindi : Text;
    description : Text;
    descriptionHindi : Text;
    phone : Text;
    address : Text;
    logoBase64 : Text;
  };

  type OldFeedStock = {
    id : Nat;
    feedType : Text;
    totalStock : Float;
    dailyPerCow : Float;
    lastUpdated : Time.Time;
    updatedBy : Text;
  };

  type OldFeedHistory = {
    id : Nat;
    feedType : Text;
    action : Text;
    quantity : Float;
    notes : Text;
    date : Time.Time;
    recordedBy : Text;
  };

  // The stable state consumed from the previous actor version
  // Fields use `var` when the old actor declared them `stable var`,
  // and no `var` for immutable stable fields (like MAX_USERS).
  public type OldActor = {
    MAX_USERS : Nat;
    var cowsArr : [OldCow];
    var cowIdCounter : Nat;
    var calvesArr : [OldCalf];
    var calfIdCounter : Nat;
    var donationsArr : [OldDonation];
    var donationIdCounter : Nat;
    var healthRecordsArr : [OldHealthRecord];
    var healthRecordIdCounter : Nat;
    var announcementsArr : [OldAnnouncement];
    var announcementIdCounter : Nat;
    var usersArr : [OldUser];
    var userIdCounter : Nat;
    var changeLogsArr : [OldChangeLog];
    var changeLogIdCounter : Nat;
    var milkRecordsArr : [OldMilkRecord];
    var milkRecordIdCounter : Nat;
    var gaushaalaProfile : OldGaushaalaProfile;
    var feedStocksArr : [OldFeedStock];
    var feedHistoriesArr : [OldFeedHistory];
    var feedHistoryIdCounter : Nat;
    var feedStockIdCounter : Nat;
    var userHeartbeatsArr : [(Nat, Time.Time)];
  };

  // The new actor state (enhanced orthogonal persistence — List-based collections)
  public type NewActor = {
    users : List.List<Types.User>;
    var userIdCounter : Nat;
    heartbeats : List.List<(Nat, Int)>;
    cows : List.List<Types.Cow>;
    var cowIdCounter : Nat;
    calves : List.List<Types.Calf>;
    var calfIdCounter : Nat;
    donations : List.List<Types.Donation>;
    var donationIdCounter : Nat;
    healthRecords : List.List<Types.HealthRecord>;
    var healthRecordIdCounter : Nat;
    announcements : List.List<Types.Announcement>;
    var announcementIdCounter : Nat;
    milkRecords : List.List<Types.MilkRecord>;
    var milkRecordIdCounter : Nat;
    changeLogs : List.List<Types.ChangeLog>;
    var changeLogIdCounter : Nat;
    var profile : Types.GaushaalaProfile;
    feedStocks : List.List<Types.FeedStock>;
    feedHistories : List.List<Types.FeedHistory>;
    var feedHistoryIdCounter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let users = List.empty<Types.User>();
    for (u in old.usersArr.values()) {
      users.add({ id = u.id; name = u.name; role = u.role; pin = u.pin });
    };

    let heartbeats = List.empty<(Nat, Int)>();
    for ((uid, ts) in old.userHeartbeatsArr.values()) {
      heartbeats.add((uid, ts));
    };

    let cows = List.empty<Types.Cow>();
    for (c in old.cowsArr.values()) {
      cows.add({
        id = c.id;
        name = c.name;
        breed = c.breed;
        age = c.age;
        healthStatus = c.healthStatus;
        description = c.description;
        addedDate = c.addedDate;
        tagNumber = c.tagNumber;
        qrCode = c.qrCode;
      });
    };

    let calves = List.empty<Types.Calf>();
    for (c in old.calvesArr.values()) {
      calves.add({
        id = c.id;
        cowId = c.cowId;
        birthMonth = c.birthMonth;
        birthYear = c.birthYear;
        gender = c.gender;
        tagNumber = c.tagNumber;
        notes = c.notes;
        addedDate = c.addedDate;
      });
    };

    let donations = List.empty<Types.Donation>();
    for (d in old.donationsArr.values()) {
      donations.add({
        id = d.id;
        donorName = d.donorName;
        amount = d.amount;
        date = d.date;
        message = d.message;
        purpose = d.purpose;
      });
    };

    let healthRecords = List.empty<Types.HealthRecord>();
    for (h in old.healthRecordsArr.values()) {
      healthRecords.add({
        id = h.id;
        cowId = h.cowId;
        date = h.date;
        notes = h.notes;
        status = h.status;
        vetName = h.vetName;
      });
    };

    let announcements = List.empty<Types.Announcement>();
    for (a in old.announcementsArr.values()) {
      announcements.add({
        id = a.id;
        title = a.title;
        titleHindi = a.titleHindi;
        content = a.content;
        contentHindi = a.contentHindi;
        date = a.date;
        isActive = a.isActive;
      });
    };

    let milkRecords = List.empty<Types.MilkRecord>();
    for (m in old.milkRecordsArr.values()) {
      milkRecords.add({
        id = m.id;
        cowId = m.cowId;
        cowName = m.cowName;
        date = m.date;
        morning = m.morning;
        evening = m.evening;
        addedDate = m.addedDate;
        changedBy = m.changedBy;
      });
    };

    let changeLogs = List.empty<Types.ChangeLog>();
    for (l in old.changeLogsArr.values()) {
      changeLogs.add({
        id = l.id;
        userName = l.userName;
        action = l.action;
        entity = l.entity;
        entityName = l.entityName;
        details = l.details;
        timestamp = l.timestamp;
      });
    };

    let feedStocks = List.empty<Types.FeedStock>();
    for (s in old.feedStocksArr.values()) {
      feedStocks.add({
        id = s.id;
        feedType = s.feedType;
        totalStock = s.totalStock;
        dailyPerCow = s.dailyPerCow;
        lastUpdated = s.lastUpdated;
        updatedBy = s.updatedBy;
      });
    };

    let feedHistories = List.empty<Types.FeedHistory>();
    for (h in old.feedHistoriesArr.values()) {
      feedHistories.add({
        id = h.id;
        feedType = h.feedType;
        action = h.action;
        quantity = h.quantity;
        notes = h.notes;
        date = h.date;
        recordedBy = h.recordedBy;
      });
    };

    {
      users;
      var userIdCounter = old.userIdCounter;
      heartbeats;
      cows;
      var cowIdCounter = old.cowIdCounter;
      calves;
      var calfIdCounter = old.calfIdCounter;
      donations;
      var donationIdCounter = old.donationIdCounter;
      healthRecords;
      var healthRecordIdCounter = old.healthRecordIdCounter;
      announcements;
      var announcementIdCounter = old.announcementIdCounter;
      milkRecords;
      var milkRecordIdCounter = old.milkRecordIdCounter;
      changeLogs;
      var changeLogIdCounter = old.changeLogIdCounter;
      var profile = {
        name = old.gaushaalaProfile.name;
        nameHindi = old.gaushaalaProfile.nameHindi;
        description = old.gaushaalaProfile.description;
        descriptionHindi = old.gaushaalaProfile.descriptionHindi;
        phone = old.gaushaalaProfile.phone;
        address = old.gaushaalaProfile.address;
        logoBase64 = old.gaushaalaProfile.logoBase64;
      };
      feedStocks;
      feedHistories;
      var feedHistoryIdCounter = old.feedHistoryIdCounter;
    };
  };
};
