import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';

import { LevelUpModal } from '@/components/LevelUpModal';

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengeContextData {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallenge: Challenge;
  experienceToNextLevel: number;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
  closeLevelUpModal: () => void;
  profileData: ProfileProps;
  totalExperience: number;
}

interface ChallengesProviderProps {
  children: ReactNode;
  dataUser: ProfileProps;
}

interface UserProps {
  name: string;
  email: string;
  image: string;
}

interface ProfileProps {
  user: UserProps;
  level: number;
  challenges: number;
  currentxp: number;
  totalxp: number;
}

export const ChallengesContext = createContext({} as ChallengeContextData);

export function ChallengeProvider({ children, ...rest }) {
  const [dataUser] = useState(rest.user);
  const [level, setLevel] = useState(dataUser.level);
  const [currentExperience, setCurrentExperience] = useState(
    dataUser.currentxp
  );
  const [challengesCompleted, setChallengesCompleted] = useState(
    dataUser.challenges
  );
  const [totalExperience, setTotalExperience] = useState(dataUser.totalxp);

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

  const [profileData, setProfileData] = useState({
    user: dataUser.user,
    level: level,
    challenges: challengesCompleted,
    currentxp: currentExperience,
    totalxp: totalExperience,
  });

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengesCompleted', String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted]);

  useEffect(() => {
    setProfileData({
      user: dataUser.user,
      level: level,
      challenges: challengesCompleted,
      currentxp: currentExperience,
      totalxp: 0,
    });
  }, [level, currentExperience, challengesCompleted, totalExperience]);

  useMemo(() => {
    rest.saveUser(profileData);
  }, [profileData]);

  function levelUp() {
    setLevel(level + 1);
    setIsLevelUpModalOpen(true);
  }

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play();

    if (Notification.permission === 'granted') {
      new Notification('New challenge 🎉 | move.it', {
        body: `Earn ${challenge.amount} xp when completing this task`,
      });
    }
  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  function completeChallenge() {
    if (!activeChallenge) {
      return;
    }

    const { amount } = activeChallenge;
    let finalExperience = currentExperience + amount;

    if (finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();
    }

    setCurrentExperience(finalExperience);
    resetChallenge();
    setChallengesCompleted(challengesCompleted + 1);
    setTotalExperience(totalExperience + amount);
  }

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false);
  }

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        challengesCompleted,
        activeChallenge,
        experienceToNextLevel,
        levelUp,
        startNewChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal,
        profileData,
        totalExperience,
      }}
    >
      {children}

      {isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  );
}
