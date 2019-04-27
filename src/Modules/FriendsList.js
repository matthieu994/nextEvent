import React from "react";
import { TouchableHighlight, View, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";

export default function FriendsList({ friends, selectedFriends, selectFriend, ...props }) {
  return Object.keys(friends)
    .map((friend, index) => {
      if (!props.edit && friends[friend].status !== "OK") return null
      const selected = selectedFriends.includes(friend)
      return (
        <View key={index} style={{ width: "50%" }}>
          <TouchableHighlight
            activeOpacity={0.9}
            onPress={() => selectFriend(friend)}
          >
            <ListItem
              key={index}
              title={
                friends[friend].displayName +
                " " +
                friends[friend].familyName
              }
              containerStyle={[
                styles.listItemContainer,
                selected && styles.selectedFriend
              ]}
              leftAvatar={{
                rounded: true,
                size: 35,
                source: {
                  uri:
                    friends[friend].photoURL ||
                    props.defaultProfileURL
                }
              }}
            />
          </TouchableHighlight>
        </View>
      )
    })
}

const styles = StyleSheet.create({
  listItemContainer: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: "rgba(150, 150, 160, 0.5)",
    backgroundColor: "rgb(242, 245, 250)"
  },
  selectedFriend: {
    backgroundColor: "rgb(210, 215, 230)",
    elevation: 1
  }
})
