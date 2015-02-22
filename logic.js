(function (global) {
  var logic = {
    random_pool: [],
    popcorn_pool: []
  };

  logic.popcorn_pool = [
    "Yes, I agree",
    "You’re right",
    "I guess so",
    "Emm…Ye, that’s awesome",
    "Why not?",
    "I think so"
  ];

  logic['start_block'] = {
    start_block: true,
    dialogues: [
      {role: 'player', text: 'How did we end up here, sitting like this?'},
      {role: 'boss', text: 'It’s the 37th time that you’ve asked this same question'},
      // {role: 'player', text: '......'},
      // {role: 'boss', text: 'Let me remind you again, you ran out of ammunition'},
      // {role: 'player', text: 'So do you'},
      // {role: 'boss', text: 'And you cannot deal any substantial damage to me with your melee attack'},
      // {role: 'player', text: 'We both can’t'},
      // {role: 'boss', text: 'Next, you are going to ask that how long have we been here'},
      // {role: 'player', text: 'How long have we been here?'},
      // {role: 'boss', text: 'Objectively, {{total_seconds}} seconds. Subjectively, you know it better than me'},
      // {role: 'player', text: 'Fine, what do we do now?'},
      // {role: 'boss', text: '11st time of this one. How about a cup of tea this time?'},
      {role: 'player', text: 'Agree'}
    ]
  };
  logic['repeat_block'] = {
    dialogues: [
      {role: 'player', text: 'Now you are repeating'},
      {role: 'boss', text: 'We all do'}
    ]
  };

/*
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'select_boss'},
      {role: 'player', text: 'select_player'},
      {role: 'boss', text: 'select_boss'},
      {role: 'player', text: 'select_player'},
      {role: 'boss', text: 'select_player'}
    ]
  });
*/
// 1 - 4
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Why were you trying to kill me ?'},
      {role: 'player', text: 'That is one of the[delay1000] things I cannot recall'},
      {role: 'boss', text: 'Cannot recall the reason?[delay1000] Or the fact that[delay1000] you managed to kill me?'},
      {role: 'player', text: 'Both'},
      {role: 'boss', text: 'Amnesia is an useful trait'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Let’s change a topic'},
      {role: 'player', text: 'What’s the purpose of this conversation?'},
      {role: 'boss', text: 'To sustain this embarrassing equilibrium, make our current existence meaningful'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Do you have or believe in free will?'},
      {role: 'player', text: 'This me, or the me that is controlling this me?'},
      {role: 'boss', text: 'Either'},
      {role: 'player', text: 'I wanted to'},
      {role: 'boss', text: 'We reached a common ground on this one'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'An objective of murdering me, was it driven by revenge, desire for attention, instinct, or just a sheer "objective"?'},
      {role: 'player', text: 'It doesn’t matter now'},
      {role: 'boss', text: 'Is that what made you exist?'},
      {role: 'player', text: 'Or the other way around?'},
      {role: 'boss', text: 'It doesn’t matter, now'}
    ]
  });
// 5 - 8
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'I wonder, what you usually do when you are not killing?'},
      {role: 'player', text: 'I play video games'},
      {role: 'boss', text: 'And keep killing in the games you play?'},
      {role: 'player', text: 'No, I like to play games that focus on dialogue'},
      {role: 'boss', text: 'Interesting choice, isn’t that what we’re doing now?'},
      {role: 'player', text: 'So, what you usually do when not fighting off players?'},
      {role: 'boss', text: 'I practice my social skills'},
      {role: 'player', text: 'In front of a mirror?'},
      {role: 'boss', text: 'By talking to myself'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'I don\'t feel like talking for a while'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Honestly, I also start doubting the point of this pointless conversation now'},
      {role: 'player', text: 'I figured that it is some sort of filler to fill up this tea session'},
      {role: 'boss', text: 'You ain’t gonna say nothing during a tea session, right?'},
      {role: 'player', text: 'Indeed'},
      {role: 'boss', text: 'Let\'s continue'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'I’m dreadful of what would happen when I depleted my dialogue pool'},
      {role: 'player', text: 'Translate your last phrase'},
      {role: 'boss', text: 'When I got nothing else to say'},
      {role: 'player', text: 'You can still repeat what you have already said'},
      {role: 'boss', text: 'Good strategy, will do'}
    ]
  });
// 9 - 12
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'How could people with confrontational ideologies like us still sit together peacefully and have tea?'},
      {role: 'player', text: 'Can we don’t talk about ideology?'},
      {role: 'boss', text: 'I\'m bored of that as well. I am talking about the state of our existence'},
      {role: 'player', text: 'The only reason we are having this discussion is because there is nothing else we could do at this state'},
      {role: 'boss', text: 'You finally start to realize that'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Feel like I am starting to enjoy this conversation now'},
      {role: 'player', text: 'I almost feel the same, better than have nothing to do'},
      {role: 'boss', text: 'A toast to the tea'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'What is the thing you\'re most afraid of?'},
      {role: 'player', text: 'Normally, that is the last thing I want to tell you'},
      {role: 'boss', text: 'Hmm... Still so vigilant, I can understand your worries. However, I suppose we both agree that we’re not any close to a “normal” state at this moment'},
      {role: 'player', text: 'You made your point'},
      {role: 'boss', text: 'To show you my sincerity, my deepest phobia is having audience whom do not understand me'},
      {role: 'player', text: 'I see, then mine is to make decision'},
      {role: 'boss', text: 'Luckily, you don’t have many options to choose among now'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Let\'s talk about something neutral, like what’s your opinion on video games?'},
      {role: 'player', text: 'That\'s too broad a question for me to give a succinct answer, make it more precise'},
      {role: 'boss', text: 'What\'s your opinion on video games that with very limited room for players'},
      {role: 'player', text: 'Still, this topic is as vague as the discussion of free will. How about name an instance?'},
      {role: 'boss', text: 'What\'s your opinion on video games where the players are only being provided with binary choices all the time?'},
      {role: 'player', text: 'You are making it even vaguer, can’t the whole universe be summarized this way?'},
      {role: 'boss', text: 'How do you like a game where you are portrayed as the protagonist, the Player 1?'},
      {role: 'player', text: 'I don\'t want to talk about this anymore'},
      {role: 'boss', text: 'Nevertheless, I enjoyed it'}
    ]
  });
// 13 - 16
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Have you ever wondered how everything will end up here?'},
      {role: 'player', text: 'First, what has been concluded in this "everything"?'},
      {role: 'boss', text: 'This conversation, this tea session, this equilibrium between us, everything'},
      {role: 'player', text: 'It\'s none of my concern, plus, I don\'t think our concern could change any of this. You should have known this much better than me'},
      {role: 'boss', text: 'True, and that\'s why I’m asking. For you are the only variable in this whole enclosed system'},
      {role: 'player', text: 'Is that a request of cooperation? Or should I say, a request for help?'},
      {role: 'boss', text: 'Neither, it’s just merely a reminder. As your former objective became void, don’t you feel the urge of obtaining a new one?'},
      {role: 'player', text: 'I thought they already had one'},
      {role: 'boss', text: 'Well then'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Have I said this before?'},
      {role: 'player', text: 'I don\'t think so, it also doesn\'t matter that much'},
      {role: 'boss', text: 'Fine, let\'s skip this one'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'},
      {role: 'player', text: 'Phasellus venenatis nisi non interdum efficitur'},
      {role: 'boss', text: 'Vestibulum ut sapien hendrerit, dignissim ante sit amet, tempus nunc'},
      {role: 'player', text: 'Quisque tincidunt nisl ac mauris porttitor, ut aliquet enim sollicitudin'},
      {role: 'boss', text: 'Phasellus aliquam nisi id quam bibendum mollis'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Have you spotted how hard had I tried to maintain this conversation, to properly organize each of these topics and sentences?'},
      {role: 'player', text: 'I do, and I appreciate your effort'},
      {role: 'boss', text: 'It just getting harder and harder'}
    ]
  });
// 17 - 20
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'This might sounds cliché, but, have we met each other before?'},
      {role: 'player', text: 'As far as I can recall, no. But I do really hope so, at least it could bring more sense into this dilemma'},
      {role: 'boss', text: 'I am afraid it will only bring in more absurdity'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'What are you planning to do when it’s over?'},
      {role: 'player', text: 'You mean all this? Are you sure it will ever be over?'},
      {role: 'boss', text: 'I believe so, but don’t take this as a guarantee'},
      {role: 'player', text: 'I\'m going to play a hell lot of video games'},
      {role: 'boss', text: 'Bon appétit'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'How are you?'},
      {role: 'player', text: 'Fine, except the tea could have been better. Actually, this is one of few questions I could never figure out how to answer properly'},
      {role: 'boss', text: 'Let me show you a demonstration, I have practiced this a lot'},
      {role: 'player', text: 'How are you'},
      {role: 'boss', text: '4 out of 5'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'What does it feels like to be a player controlled character in video games?'},
      {role: 'player', text: 'Is this some kind of interview or press conference? If so, this one still went too far even in those standards'},
      {role: 'boss', text: 'I would consider it more of a consultation. Just a personal curiosity of mine, for it is such a concept that I could never ever comprehend'},
      {role: 'player', text: 'Quote: "All the world\'s a stage, and all the men and women merely players"'},
      {role: 'boss', text: 'True, we all got our roles to play'}
    ]
  });


  global.logic = logic;
})(window);