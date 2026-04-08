import Types "types/common";
import List "mo:core/List";
import Migration "migration";

import UsersApiMixin "mixins/users-api";
import CowsApiMixin "mixins/cows-api";
import CalvesApiMixin "mixins/calves-api";
import DonationsApiMixin "mixins/donations-api";
import HealthApiMixin "mixins/health-api";
import AnnouncementsApiMixin "mixins/announcements-api";
import MilkApiMixin "mixins/milk-api";
import ProfileApiMixin "mixins/profile-api";
import FeedApiMixin "mixins/feed-api";
import ChangeLogsApiMixin "mixins/changelogs-api";

(with migration = Migration.run)
actor {
  // ─── Users ───────────────────────────────────────────────
  let users = List.empty<Types.User>();
  var userIdCounter : Nat = 2;
  let heartbeats = List.empty<(Nat, Int)>();

  // ─── Cows ────────────────────────────────────────────────
  let cows = List.empty<Types.Cow>();
  var cowIdCounter : Nat = 1;

  // ─── Calves ──────────────────────────────────────────────
  let calves = List.empty<Types.Calf>();
  var calfIdCounter : Nat = 1;

  // ─── Donations ───────────────────────────────────────────
  let donations = List.empty<Types.Donation>();
  var donationIdCounter : Nat = 1;

  // ─── Health records ──────────────────────────────────────
  let healthRecords = List.empty<Types.HealthRecord>();
  var healthRecordIdCounter : Nat = 1;

  // ─── Announcements ───────────────────────────────────────
  let announcements = List.empty<Types.Announcement>();
  var announcementIdCounter : Nat = 1;

  // ─── Milk records ────────────────────────────────────────
  let milkRecords = List.empty<Types.MilkRecord>();
  var milkRecordIdCounter : Nat = 1;

  // ─── Change logs ─────────────────────────────────────────
  let changeLogs = List.empty<Types.ChangeLog>();
  var changeLogIdCounter : Nat = 1;

  // ─── Profile ─────────────────────────────────────────────
  var profile : Types.GaushaalaProfile = {
    name = "Annpurna Gau Aashram";
    nameHindi = "अन्नपूर्णा गौ आश्रम";
    description = "A shelter dedicated to the care and protection of animals.";
    descriptionHindi = "जानवरों की देखभाल और सुरक्षा के लिए समर्पित एक गौशाला।";
    phone = "";
    address = "";
    logoBase64 = "";
  };

  // ─── Feed ────────────────────────────────────────────────
  let feedStocks = List.empty<Types.FeedStock>();
  let feedHistories = List.empty<Types.FeedHistory>();
  var feedHistoryIdCounter : Nat = 1;

  // ─── Mixin composition ───────────────────────────────────
  include UsersApiMixin(users, userIdCounter, heartbeats);
  include CowsApiMixin(cows, cowIdCounter, changeLogs, changeLogIdCounter);
  include CalvesApiMixin(calves, cows, calfIdCounter, changeLogs, changeLogIdCounter);
  include DonationsApiMixin(donations, donationIdCounter, changeLogs, changeLogIdCounter);
  include HealthApiMixin(healthRecords, cows, healthRecordIdCounter, changeLogs, changeLogIdCounter);
  include AnnouncementsApiMixin(announcements, announcementIdCounter, changeLogs, changeLogIdCounter);
  include MilkApiMixin(milkRecords, milkRecordIdCounter, changeLogs, changeLogIdCounter);
  include ProfileApiMixin(profile, changeLogs, changeLogIdCounter);
  include FeedApiMixin(feedStocks, feedHistories, feedHistoryIdCounter, changeLogs, changeLogIdCounter);
  include ChangeLogsApiMixin(changeLogs, changeLogIdCounter);
};
