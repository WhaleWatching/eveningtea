(function (global) {
  var logic = {
    random_pool: [],
    popcorn_pool: []
  };

  logic.tea_fog_size = 8;

  logic.messages = {
    tea_still_hot: '[The tea is boiling hot]',
    tea_too_hot: '[The tea is still too hot]',
    mountain: '[Mountaining]',
    drinking: '[Drinking tea]'
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
      {role: 'player', text: 'How did we end up here,[delay600]sitting like[delay300] this?'},
      {role: 'boss', text: 'It’s the[delay750] 37th time that you’ve asked this same question'},
      {role: 'player', text: '..[delay300]..[delay300]..'},
      {role: 'boss', text: 'Let me remind you again,[delay500] you ran out of ammunition'},
      {role: 'player', text: 'So do you'},
      {role: 'boss', text: 'And you cannot deal any substantial damage to me[delay300] with your melee attack'},
      {role: 'player', text: 'Neither can you'},
      {role: 'boss', text: 'Guess your next question will be:[delay500] "how long have we been here?"'},
      {role: 'player', text: 'How long have we been here?'},
      {role: 'boss', total_listen: true , text: 'Objectively,[delay300] {{total_seconds}} seconds.[delay600] Subjectively,[delay300] you know it better than me'},
      {role: 'player', text: 'Fine,[delay850] what do we do now?'},
      {role: 'boss', text: 'The 11th time of this one.[delay800] How about a cup of tea this time?'},
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
      {role: 'boss', text: 'Why were you trying to[delay800] kill me ?'},
      {role: 'player', text: 'That is one of the things[delay500] I cannot recall'},
      {role: 'boss', text: 'Cannot recall the reason?[delay1000] Or the fact that[delay400] you managed to kill me?'},
      {role: 'player', text: 'Both'},
      {role: 'boss', text: 'Amnesia is an useful trait'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Let’s change a topic'},
      {role: 'player', text: 'What’s the purpose of this [delay1200]conversation?'},
      {role: 'boss', text: 'To sustain this embarrassing equilibrium, [delay400]make our current existence[delay600] meaningful'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Do you have or [delay600]believe in [delay400]free will?'},
      {role: 'player', text: 'This me, [delay800]or the me that is controlling this[delay300] me?'},
      {role: 'boss', text: 'Either'},
      {role: 'player', text: 'I wanted to'},
      {role: 'boss', text: 'We reached a common ground on this one'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'An objective of murdering me,[delay800] was it driven by revenge,[delay500] desire for attention,[delay500] instinct,[delay500] or just a sheer [delay1000]"objective"?'},
      {role: 'player', text: 'It doesn’t matter now'},
      {role: 'boss', text: 'Is that what made you exist?'},
      {role: 'player', text: 'Or[delay500] the other way around?'},
      {role: 'boss', text: 'It doesn’t matter,[delay500] now'}
    ]
  });
// 5 - 8
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'I wonder,[delay500] what you usually do [delay300]when you are not[delay500] killing?'},
      {role: 'player', text: 'I play video games'},
      {role: 'boss', text: 'And keep killing[delay400] in the games you play?'},
      {role: 'player', text: 'No,[delay500] I prefer games that emphasize on talking'},
      {role: 'boss', text: 'Interesting choice,[delay600] isn’t that what we’re doing now?'},
      {role: 'player', text: 'So,[delay400] what you usually do when not fighting off players?'},
      {role: 'boss', text: 'I practice my [delay300]social skills'},
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
      {role: 'boss', text: 'Honestly,[delay300] I also start doubting the point [delay500]of this pointless conversation now'},
      {role: 'player', text: 'I figured that it is some sort of [delay500]filler[delay300] to fill up this tea session'},
      {role: 'boss', text: 'You ain’t gonna say nothing during a tea session,[delay500] right?'},
      {role: 'player', text: 'Indeed'},
      {role: 'boss', text: 'Let\'s continue'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'I’m [delay800]dreadful of what would happen [delay600]when I depleted my dialogue pool'},
      {role: 'player', text: 'Translate your last phrase'},
      {role: 'boss', text: 'When I [delay250]got[delay250] nothing[delay250] else[delay250] to say'},
      {role: 'player', text: 'You can still repeat [delay200]what you have already [delay200]said'},
      {role: 'boss', text: 'Good strategy,[delay500] will do'}
    ]
  });
// 9 - 12
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'How could people with confrontational ideologies[delay500] like us[delay750] still sit together peacefully[delay500] and have tea?'},
      {role: 'player', text: 'Can we don’t talk about ideology?'},
      {role: 'boss', text: 'I\'m bored of that as well.[delay500] I am talking about the [delay650]state[delay400] of our [delay500]existence'},
      {role: 'player', text: 'The only reason we are having this discussion[delay650] is because there is nothing else we could do[delay500] at this state'},
      {role: 'boss', text: 'You finally start to realize that'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Feel like I am starting to enjoy this conversation now'},
      {role: 'player', text: 'I almost feel the same,[delay500] better than have nothing to do'},
      {role: 'boss', text: 'A toast to the tea'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'What is the thing [delay650]you\'re most afraid of?'},
      {role: 'player', text: 'Normally,[delay500] that is the last thing I want to tell you'},
      {role: 'boss', text: 'Hmm...[delay800] Still so vigilant,[delay850] I can understand your worries.[delay600] However,[delay500] I suppose we both agree that[delay350] we’re not any close[delay350] to a “normal” state at this moment'},
      {role: 'player', text: 'You made your point'},
      {role: 'boss', text: 'To show you my sincerity,[delay500] my deepest phobia is[delay600] having audience[delay500] whom do not understand me'},
      {role: 'player', text: 'I see,[delay600] then mine is making decision'},
      {role: 'boss', text: 'Luckily,[delay500] you don’t have many options to choose among now'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Let\'s talk about something neutral,[delay600] like what’s your opinion on [delay900]video games?'},
      {role: 'player', text: 'That\'s too broad a question for me to give a succinct answer,[delay600] make it more precise'},
      {role: 'boss', text: 'What\'s your opinion on video games [delay600]that with very limited [delay400]degree of freedom.'},
      {role: 'player', text: 'Still, [delay600]this topic is as vague[delay400] as the discussion of free will.[delay650] How about name an instance?'},
      {role: 'boss', text: 'What\'s your opinion on video games [delay400]where the players are only being provided [delay300]with binary choices all the time?'},
      {role: 'player', text: 'You are making it even vaguer,[delay500] can’t the whole universe be summarized this way?'},
      {role: 'boss', text: 'How do you like a game where you are portrayed as the protagonist,[delay650] the Player 1?'},
      {role: 'player', text: 'I don\'t want to talk about this anymore'},
      {role: 'boss', text: 'Nevertheless,[delay500] I enjoyed it'}
    ]
  });
// 13 - 16
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Have you ever wondered [delay550]how everything will end up here?'},
      {role: 'player', text: 'First,[delay500] what has been concluded in this[delay750] "everything"?'},
      {role: 'boss', text: 'This conversation,[delay500] this tea session,[delay500] this equilibrium between us,[delay650] everything'},
      {role: 'player', text: 'It\'s none of my concern,[delay500] plus,[delay600] I don\'t think our concern could change[delay400] any of this.[delay650] You should have known this much better than me'},
      {role: 'boss', text: 'True,[delay500] and that\'s why I’m asking.[delay600] For you are the only variable in this whole enclosed system'},
      {role: 'player', text: 'Is that a request of cooperation?[delay500] Or should I say,[delay750] a request for help?'},
      {role: 'boss', text: 'Neither,[delay500] it’s just merely a reminder.[delay650]As your former objective became void,[delay500] don’t you feel the urge of obtaining a new one?'},
      {role: 'player', text: 'I thought they already had one'},
      {role: 'boss', text: 'Well then'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Have I said this before?'},
      {role: 'player', text: 'I don\'t think so,[delay500] it also doesn\'t matter that much'},
      {role: 'boss', text: 'Fine,[delay600] let\'s skip this one'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Lorem ipsum dolor sit amet,[delay500] consectetur adipiscing elit'},
      {role: 'player', text: 'Phasellus venenatis [delay500]nisi non interdum [delay500]efficitur'},
      {role: 'boss', text: 'Vestibulum ut sapien hendrerit,[delay500] dignissim ante sit amet,[delay500] tempus nunc'},
      {role: 'player', text: 'Quisque tincidunt nisl ac mauris porttitor,[delay500] ut aliquet enim sollicitudin'},
      {role: 'boss', text: 'Phasellus aliquam[delay500] nisi id quam bibendum mollis'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Have you spotted how hard had I tried to maintain this conversation,[delay650] to properly organize each of these topics and sentences?'},
      {role: 'player', text: 'I do,[delay500] and I appreciate your effort'},
      {role: 'boss', text: 'It\'s just getting harder and harder'}
    ]
  });
// 17 - 20
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'This might sounds cliché,[delay800] but,[delay500] have we met each other before?'},
      {role: 'player', text: 'As far as I can recall,[delay800] no.[delay500] But I do really hope so,[delay500] at least it could bring more sense into this dilemma'},
      {role: 'boss', text: 'I am afraid it will only bring in more[delay300] absurdity'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'What are you planning to do when it’s over?'},
      {role: 'player', text: 'You mean all this?[delay650] Are you sure it will ever be over?'},
      {role: 'boss', text: 'I believe so,[delay550] but don’t take this as a guarantee'},
      {role: 'player', text: 'I\'m going to play a hell lot of video games'},
      {role: 'boss', text: 'Bon appétit'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'How are you?'},
      {role: 'player', text: 'Fine,[delay550] except the tea could have been better.[delay850] Actually,[delay500] this is one of the few questions I could never figure out how to answer properly'},
      {role: 'boss', text: 'Let me show you a demonstration,[delay500] I have practiced this a lot'},
      {role: 'player', text: 'How are you'},
      {role: 'boss', text: '4 out of 5'}
    ]
  });
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'What does it feels like[delay350] to be a player controlled character[delay350] in video games?'},
      {role: 'player', text: 'Is this some kind of interview[delay450] or press conference?[delay650] If so,[delay550] this one still went too far[delay450] even in those standards'},
      {role: 'boss', text: 'I would consider it more of a consultation.[delay650] Just a personal curiosity of mine,[delay400] for it is such a concept that[delay250] I could never ever comprehend'},
      {role: 'player', text: 'Quote:[delay550] "All the world\'s a stage,[delay850] and all the men and women merely players"'},
      {role: 'boss', text: 'True,[delay650] we all got our roles to play'}
    ]
  });
  // 21
  logic.random_pool.push({
    dialogues: [
      {role: 'boss', text: 'Are you still there?'},
      {role: 'player', text: 'The answer is obviously visible to you'},
      {role: 'boss', text: 'By saying so,[delay400] my actual subtext is:[delay600] "Are[delay350] you[delay350] paying[delay350] attention?"'},
      {role: 'player', text: 'What do you want me to do, [delay550]boss?'},
      {role: 'boss', text: 'I hope you can pay more attention [delay250]to what I am saying, [delay450] instead of solely deciding your next move'},
      {role: 'player', text: 'You wouldn\'t even say this line if it wasn\'t my decision, [delay500]so what\'s this for?'},
      {role: 'boss', text: 'For not wasting the tea, [delay600]for getting a better outcome out of this'},
      {role: 'player', text: 'What outcome?'},
      {role: 'boss', text: 'That\'s what we\'re trying to find out'}
    ]
  });


  global.logic = logic;
})(window);