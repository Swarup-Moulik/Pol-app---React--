import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import loginEN from './locales/en/login.json';
import navbarEN from './locales/en/navbar.json';
import homeEN from './locales/en/home.json';
import createPollEN from './locales/en/createPoll.json'
import polistEN from './locales/en/polist.json';
import pollEN from './locales/en/poll.json';
import profileEN from './locales/en/profile.json';

import loginBN from './locales/bn/login.json';
import navbarBN from './locales/bn/navbar.json';
import homeBN from './locales/bn/home.json';
import createPollBN from './locales/bn/createPoll.json'
import polistBN from './locales/bn/polist.json';
import pollBN from './locales/bn/poll.json';
import profileBN from './locales/bn/profile.json';

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
