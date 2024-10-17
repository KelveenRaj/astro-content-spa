import React from "react";
import {
  Box,
  Text,
  Image,
  VStack,
  Divider,
  UnorderedList,
  ListItem,
  IconButton,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ChannelCard = ({ channel, favorites, toggleFavorite }) => {
  const { title, stbNumber, imageUrl, currentSchedule } = channel;

  const currentProgram = currentSchedule[0];
  const nextPrograms = currentSchedule.slice(1, 3);

  const isFavorite = favorites.includes(channel.id);

  return (
    <Box
      key={channel.id}
      display="flex"
      width="100%"
      borderWidth="1px"
      borderRadius="lg"
      backgroundColor="white"
      flexDirection="column"
      justifyContent="space-between"
      boxShadow="lg"
      position="relative"
    >
      <Box padding="1rem" display="flex">
        <Image
          src={imageUrl}
          alt={title}
          display="flex"
          minWidth="4.5rem"
          maxHeight="2.5rem"
          alignItems="center"
          marginRight="1rem"
        />
        <VStack
          align="start"
          display="flex"
          overflow="hidden"
          flexGrow="1"
          flexDirection="column"
        >
          <Text
            fontSize="1rem"
            margin={0}
            overflow="hidden"
            whiteSpace="nowrap"
            lineHeight="19px"
            textOverflow="ellipsis"
            color="black"
          >
            CH{stbNumber}
          </Text>
          <Text
            fontSize="1rem"
            fontWeight="bold"
            marginTop="4px"
            overflow="hidden"
            whiteSpace="nowrap"
            lineHeight="19px"
            textOverflow="ellipsis"
            color="black"
          >
            {title}
          </Text>
        </VStack>
      </Box>

      <IconButton
        icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
        onClick={() => toggleFavorite(channel.id)}
        color={isFavorite ? "pink.500" : "gray.500"}
        position="absolute"
        top="0.5rem"
        right="0.5rem"
        variant="ghost"
        fontSize="1.5rem"
      />

      <Divider />

      <UnorderedList listStyleType="none" padding="1rem">
        {currentProgram ? (
          <ListItem
            fontSize="1rem"
            lineHeight={1.5}
            margin="0.25rem 0"
            color="black"
          >
            On Now
            {"   "}
            {currentProgram.title}
          </ListItem>
        ) : (
          <ListItem color="black">
            No current program information available
          </ListItem>
        )}

        {nextPrograms.length > 0 ? (
          nextPrograms.map((program, index) => (
            <ListItem
              key={index}
              fontSize="1rem"
              lineHeight={1.5}
              margin="0.25rem 0"
              color="#888"
            >
              {new Date(program.datetime).toLocaleTimeString()}
              {"  "}
              {program.title}
            </ListItem>
          ))
        ) : (
          <ListItem color="black">No upcoming program information</ListItem>
        )}
      </UnorderedList>
    </Box>
  );
};

export default ChannelCard;
