import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English
import loginEN from "./locales/en/login.json";
import navbarEN from "./locales/en/navbar.json";
import homeEN from "./locales/en/home.json";
import createPollEN from "./locales/en/createPoll.json";
import polistEN from "./locales/en/polist.json";
import pollEN from "./locales/en/poll.json";
import profileEN from "./locales/en/profile.json";

// Bengali
import loginBN from "./locales/bn/login.json";
import navbarBN from "./locales/bn/navbar.json";
import homeBN from "./locales/bn/home.json";
import createPollBN from "./locales/bn/createPoll.json";
import polistBN from "./locales/bn/polist.json";
import pollBN from "./locales/bn/poll.json";
import profileBN from "./locales/bn/profile.json";

// Marathi
import loginMR from "./locales/mr/login.json";
import navbarMR from "./locales/mr/navbar.json";
import homeMR from "./locales/mr/home.json";
import createPollMR from "./locales/mr/createPoll.json";
import polistMR from "./locales/mr/polist.json";
import pollMR from "./locales/mr/poll.json";
import profileMR from "./locales/mr/profile.json";

// Gujarati
import loginGU from "./locales/gu/login.json";
import navbarGU from "./locales/gu/navbar.json";
import homeGU from "./locales/gu/home.json";
import createPollGU from "./locales/gu/createPoll.json";
import polistGU from "./locales/gu/polist.json";
import pollGU from "./locales/gu/poll.json";
import profileGU from "./locales/gu/profile.json";

// Tamil
import loginTA from "./locales/ta/login.json";
import navbarTA from "./locales/ta/navbar.json";
import homeTA from "./locales/ta/home.json";
import createPollTA from "./locales/ta/createPoll.json";
import polistTA from "./locales/ta/polist.json";
import pollTA from "./locales/ta/poll.json";
import profileTA from "./locales/ta/profile.json";

// Telugu
import loginTE from "./locales/te/login.json";
import navbarTE from "./locales/te/navbar.json";
import homeTE from "./locales/te/home.json";
import createPollTE from "./locales/te/createPoll.json";
import polistTE from "./locales/te/polist.json";
import pollTE from "./locales/te/poll.json";
import profileTE from "./locales/te/profile.json";

// Malayalam
import loginML from "./locales/ml/login.json";
import navbarML from "./locales/ml/navbar.json";
import homeML from "./locales/ml/home.json";
import createPollML from "./locales/ml/createPoll.json";
import polistML from "./locales/ml/polist.json";
import pollML from "./locales/ml/poll.json";
import profileML from "./locales/ml/profile.json";

// Kannada
import loginKN from "./locales/kn/login.json";
import navbarKN from "./locales/kn/navbar.json";
import homeKN from "./locales/kn/home.json";
import createPollKN from "./locales/kn/createPoll.json";
import polistKN from "./locales/kn/polist.json";
import pollKN from "./locales/kn/poll.json";
import profileKN from "./locales/kn/profile.json";

// Portuguese
import loginPT from "./locales/pt/login.json";
import navbarPT from "./locales/pt/navbar.json";
import homePT from "./locales/pt/home.json";
import createPollPT from "./locales/pt/createPoll.json";
import polistPT from "./locales/pt/polist.json";
import pollPT from "./locales/pt/poll.json";
import profilePT from "./locales/pt/profile.json";

// Spanish
import loginES from "./locales/es/login.json";
import navbarES from "./locales/es/navbar.json";
import homeES from "./locales/es/home.json";
import createPollES from "./locales/es/createPoll.json";
import polistES from "./locales/es/polist.json";
import pollES from "./locales/es/poll.json";
import profileES from "./locales/es/profile.json";

// French
import loginFR from "./locales/fr/login.json";
import navbarFR from "./locales/fr/navbar.json";
import homeFR from "./locales/fr/home.json";
import createPollFR from "./locales/fr/createPoll.json";
import polistFR from "./locales/fr/polist.json";
import pollFR from "./locales/fr/poll.json";
import profileFR from "./locales/fr/profile.json";

// German
import loginDE from "./locales/de/login.json";
import navbarDE from "./locales/de/navbar.json";
import homeDE from "./locales/de/home.json";
import createPollDE from "./locales/de/createPoll.json";
import polistDE from "./locales/de/polist.json";
import pollDE from "./locales/de/poll.json";
import profileDE from "./locales/de/profile.json";

// Italian
import loginIT from "./locales/it/login.json";
import navbarIT from "./locales/it/navbar.json";
import homeIT from "./locales/it/home.json";
import createPollIT from "./locales/it/createPoll.json";
import polistIT from "./locales/it/polist.json";
import pollIT from "./locales/it/poll.json";
import profileIT from "./locales/it/profile.json";

// Russian
import loginRU from "./locales/ru/login.json";
import navbarRU from "./locales/ru/navbar.json";
import homeRU from "./locales/ru/home.json";
import createPollRU from "./locales/ru/createPoll.json";
import polistRU from "./locales/ru/polist.json";
import pollRU from "./locales/ru/poll.json";
import profileRU from "./locales/ru/profile.json";

const resources = {
  en: {
    login: loginEN,
    navbar: navbarEN,
    home: homeEN,
    createPoll: createPollEN,
    polist: polistEN,
    poll: pollEN,
    profile: profileEN,
  },
  bn: {
    login: loginBN,
    navbar: navbarBN,
    home: homeBN,
    createPoll: createPollBN,
    polist: polistBN,
    poll: pollBN,
    profile: profileBN,
  },
  mr: {
    login: loginMR,
    navbar: navbarMR,
    home: homeMR,
    createPoll: createPollMR,
    polist: polistMR,
    poll: pollMR,
    profile: profileMR,
  },
  gu: {
    login: loginGU,
    navbar: navbarGU,
    home: homeGU,
    createPoll: createPollGU,
    polist: polistGU,
    poll: pollGU,
    profile: profileGU,
  },
  ta: {
    login: loginTA,
    navbar: navbarTA,
    home: homeTA,
    createPoll: createPollTA,
    polist: polistTA,
    poll: pollTA,
    profile: profileTA,
  },
  te: {
    login: loginTE,
    navbar: navbarTE,
    home: homeTE,
    createPoll: createPollTE,
    polist: polistTE,
    poll: pollTE,
    profile: profileTE,
  },
  ml: {
    login: loginML,
    navbar: navbarML,
    home: homeML,
    createPoll: createPollML,
    polist: polistML,
    poll: pollML,
    profile: profileML,
  },
  kn: {
    login: loginKN,
    navbar: navbarKN,
    home: homeKN,
    createPoll: createPollKN,
    polist: polistKN,
    poll: pollKN,
    profile: profileKN,
  },
  pt: {
    login: loginPT,
    navbar: navbarPT,
    home: homePT,
    createPoll: createPollPT,
    polist: polistPT,
    poll: pollPT,
    profile: profilePT,
  },
  es: {
    login: loginES,
    navbar: navbarES,
    home: homeES,
    createPoll: createPollES,
    polist: polistES,
    poll: pollES,
    profile: profileES,
  },
  fr: {
    login: loginFR,
    navbar: navbarFR,
    home: homeFR,
    createPoll: createPollFR,
    polist: polistFR,
    poll: pollFR,
    profile: profileFR,
  },
  de: {
    login: loginDE,
    navbar: navbarDE,
    home: homeDE,
    createPoll: createPollDE,
    polist: polistDE,
    poll: pollDE,
    profile: profileDE,
  },
  it: {
    login: loginIT,
    navbar: navbarIT,
    home: homeIT,
    createPoll: createPollIT,
    polist: polistIT,
    poll: pollIT,
    profile: profileIT,
  },
  ru: {
    login: loginRU,
    navbar: navbarRU,
    home: homeRU,
    createPoll: createPollRU,
    polist: polistRU,
    poll: pollRU,
    profile: profileRU,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
