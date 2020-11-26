import React from "react";
import { Chat, Channel, ChannelHeader, Window } from "stream-chat-react";
import { MessageList, MessageInput, MessageLivestream } from "stream-chat-react";
import { MessageInputFlat, Thread } from "stream-chat-react";
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

    let channel = client.channel("livestream", "rita-ora-new", {
      name: "Rita Ora World Tour",
    });

    return (
      <Chat client={client} theme={"livestream dark"} className="stream-container__tabs--chat">
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