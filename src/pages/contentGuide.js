import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Grid,
  Text,
  Input,
  Button,
  Spinner,
  HStack,
  Heading,
  VStack,
  Image,
  IconButton,
} from "@chakra-ui/react";
import {
  FaHeart,
  FaRegHeart,
  FaFilter,
  FaSortAlphaUp,
  FaSortAlphaDown,
} from "react-icons/fa";
import ChannelCard from "../components/channelCard";
import { LANGUAGES, CATEGORIES } from "../utils/constants";

const ContentGuide = () => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [isHD, setIsHD] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortOrder, setSortOrder] = useState("none");

  useEffect(() => {
    const fetchChannels = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://contenthub-api.eco.astro.com.my/channel/all.json"
        );
        setChannels(response.data.response || []);
        setFilteredChannels(response.data.response || []);
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const filterChannels = useMemo(() => {
    setIsFiltering(true);
    let updatedChannels = channels;

    if (categoryFilter !== "All") {
      updatedChannels = updatedChannels.filter(
        (channel) => channel.category === categoryFilter
      );
    }

    if (languageFilter !== "All") {
      updatedChannels = updatedChannels.filter(
        (channel) => channel.language === languageFilter
      );
    }

    if (isHD) {
      updatedChannels = updatedChannels.filter((channel) =>
        channel.title.includes("HD")
      );
    }

    if (searchTerm) {
      updatedChannels = updatedChannels.filter(
        (channel) =>
          channel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          channel.stbNumber.includes(searchTerm)
      );
    }

    if (showFavorites) {
      updatedChannels = updatedChannels.filter((channel) =>
        favorites.includes(channel.id)
      );
    }

    if (sortOrder === "ascending") {
      updatedChannels = [...updatedChannels].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    } else if (sortOrder === "descending") {
      updatedChannels = [...updatedChannels].sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }

    return updatedChannels;
  }, [
    channels,
    categoryFilter,
    languageFilter,
    isHD,
    searchTerm,
    showFavorites,
    sortOrder,
  ]);

  useEffect(() => {
    setFilteredChannels(filterChannels);
    setIsFiltering(false);
  }, [filterChannels]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  const handleLanguageFilter = (language) => {
    setLanguageFilter(language);
  };

  const toggleFavorite = (channelId) => {
    if (favorites.includes(channelId)) {
      setFavorites(favorites.filter((id) => id !== channelId));
    } else {
      setFavorites([...favorites, channelId]);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => {
      if (prevSortOrder === "none") {
        return "ascending";
      } else if (prevSortOrder === "ascending") {
        return "descending";
      } else {
        return "none";
      }
    });
  };

  return (
    <>
      {isLoading ? (
        <Flex
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="10"
          justifyContent="center"
          alignItems="center"
          width="100vw"
          height="100vh"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#E6007D"
            size="xl"
          />
        </Flex>
      ) : (
        <>
          <VStack
            display="flex"
            alignItems="center"
            bgColor="#E6007D"
            py="20px"
          >
            <Image
              src="https://acm-assets.eco.astro.com.my/images/astro-logo-white.svg"
              alt="astro logo"
            />
            <Heading color="white">CONTENT GUIDE</Heading>
          </VStack>
          <Box p={5} maxW="1280px" mx="auto">
            <VStack display="flex" alignItems="center" mb={4}>
              <Input
                placeholder="Search Channels"
                value={searchTerm}
                onChange={handleSearch}
              />
            </VStack>
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Category
              </Text>
              <Flex wrap="wrap">
                <Button
                  onClick={() => handleCategoryFilter("All")}
                  m={1}
                  bg={categoryFilter === "All" ? "blue.500" : "gray.200"}
                  color={categoryFilter === "All" ? "white" : "black"}
                  _hover={{
                    bg: categoryFilter === "All" ? "blue.600" : "gray.300",
                  }}
                >
                  All
                </Button>
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    m={1}
                    bg={categoryFilter === category ? "blue.500" : "gray.200"}
                    color={categoryFilter === category ? "white" : "black"}
                    _hover={{
                      bg: categoryFilter === category ? "blue.600" : "gray.300",
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </Flex>
            </Box>

            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Language
              </Text>
              <Flex wrap="wrap">
                <Button
                  onClick={() => handleLanguageFilter("All")}
                  m={1}
                  bg={languageFilter === "All" ? "blue.500" : "gray.200"}
                  color={languageFilter === "All" ? "white" : "black"}
                  _hover={{
                    bg: languageFilter === "All" ? "blue.600" : "gray.300",
                  }}
                >
                  All
                </Button>
                {LANGUAGES.map((lang) => (
                  <Button
                    key={lang}
                    onClick={() => handleLanguageFilter(lang)}
                    m={1}
                    bg={languageFilter === lang ? "blue.500" : "gray.200"}
                    color={languageFilter === lang ? "white" : "black"}
                    _hover={{
                      bg: languageFilter === lang ? "blue.600" : "gray.300",
                    }}
                  >
                    {lang}
                  </Button>
                ))}
              </Flex>
            </Box>

            <Text fontWeight="bold" mb={2}>
              Filters
            </Text>
            <Flex mb={4}>
              <HStack spacing={1}>
                <Button
                  onClick={() => setIsHD(!isHD)}
                  m={1}
                  bg={isHD ? "blue.500" : "gray.200"}
                  color={isHD ? "white" : "black"}
                  _hover={{
                    bg: isHD ? "blue.600" : "gray.300",
                  }}
                >
                  HD
                </Button>

                <IconButton
                  icon={showFavorites ? <FaHeart /> : <FaRegHeart />}
                  onClick={() => setShowFavorites(!showFavorites)}
                  color={showFavorites ? "pink.500" : "gray.500"}
                  fontSize="1.5rem"
                />

                <IconButton
                  aria-label="Sort channels"
                  icon={
                    sortOrder === "ascending" ? (
                      <FaSortAlphaDown />
                    ) : sortOrder === "descending" ? (
                      <FaSortAlphaUp />
                    ) : (
                      <FaFilter />
                    )
                  }
                  onClick={toggleSortOrder}
                  m={1}
                  bg="gray.200"
                  _hover={{
                    bg: "gray.300",
                  }}
                />
              </HStack>
            </Flex>

            {isFiltering ? (
              <Flex
                justifyContent="center"
                alignItems="center"
                height="100%"
                minHeight="400px"
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="#E6007D"
                  size="xl"
                />
              </Flex>
            ) : (
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={6}
              >
                {filteredChannels.length > 0 ? (
                  filteredChannels.map((channel) => (
                    <ChannelCard
                      key={channel.id}
                      channel={channel}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                    />
                  ))
                ) : (
                  <Text>No channels available</Text>
                )}
              </Grid>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default ContentGuide;
