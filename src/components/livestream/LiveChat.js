import React from "react";
import { Chat, Channel, ChannelHeader, Window } from "stream-chat-react";
import { MessageList, MessageInput, MessageLivestream } from "stream-chat-react";
import { MessageInputFlat, Thread } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import artist1 from "../../static/images/livestream/artist1.png";
import {inject, observer} from "mobx-react";

import "stream-chat-react/dist/css/index.css";

@inject("siteStore")
@inject("rootStore")
@observer
class LiveChat extends React.Component {

  componentWillUnmount() {
    this.props.rootStore.chatClient.disconnect();
  }

  render() {
    const client = this.props.rootStore.chatClient;
    const user = this.props.rootStore.chatID;

    const username= this.props.rootStore.name;

    client.setUser(
    {
      id: username,
      name: username,
      image: `https://getstream.io/random_svg/?name=${username}`
    },
      user,
    );

    let channel = this.props.rootStore.chatClient.channel("livestream", "eluvio-fox", {
      name: "The Masked Singer",
    });

    return (
      <Chat client={client} theme={"livestream dark"} className="stream-container__chat--box">
        <Channel channel={channel} Message={MessageLivestream}>
          <Window hideOnThread>
            <ChannelHeader live />
            <MessageList />
            <MessageInput Input={MessageInputFlat} focus={false} />
          </Window>
          <Thread fullWidth autoFocus={false} />
        </Channel>
      </Chat>
    );
  }
}

export default LiveChat;