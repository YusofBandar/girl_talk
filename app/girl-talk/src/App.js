import React from 'react';

import Record from "./components/record/record";

function App() {
  return (
    <div>
      <h1>Girl Talk</h1>
      <Record tracks={data}></Record>
    </div>
  );
}


const data = [
  {
      "title":"Oh No",
      "dataPath":"../data/all_day/oh_no.json",
      "audioPath": "../audio/Oh_No.mp3"
  },
  {
      "title":"Let It Out",
      "dataPath":"../data/all_day/let_it_out.json",
      "audioPath": "../audio/let_it_out.mp3"
  },
  {
      "title":"That's Right",
      "dataPath":"../data/all_day/thats_right.json",
      "audioPath": "../audio/Thats_Right.mp3"
  },
  {
      "title":"Jump On Stage",
      "dataPath":"../data/all_day/jump_on_stage.json",
      "audioPath": "../audio/Jump_On_Stage.mp3"
  },
  {
      "title":"This is the Remix",
      "dataPath":"../data/all_day/this_is_the_remix.json",
      "audioPath": "../audio/This_is_the_Remix.mp3"
  },
  {
      "title":"On and On",
      "dataPath":"../data/all_day/on_and_on.json",
      "audioPath": "../audio/On_and_On.mp3"
  },
  {
      "title":"Get It Get It",
      "dataPath":"../data/all_day/get_it_get_it.json",
      "audioPath": "../audio/Get_It_Get_It.mp3"
  },
  {
      "title":"Down for the Count",
      "dataPath":"../data/all_day/down_for_the_count.json",
      "audioPath": "../audio/Down_for_the_Count.mp3"
  },
  {
      "title":"Make Me Wanna",
      "dataPath":"../data/all_day/make_me_wanna.json",
      "audioPath": "../audio/Make_Me_Wanna.mp3"
  }
];

export default App;
