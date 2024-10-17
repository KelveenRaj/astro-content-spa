import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Grid,
  Text,
  Input,
  Checkbox,
  Button,
  Spinner,
} from "@chakra-ui/react";
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
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  // Fetch channels from the API
  useEffect(() => {
    const fetchChannels = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://contenthub-api.eco.astro.com.my/channel/all.json"
        );
        setChannels(response.data.response || []); // Store the API response channels
        setFilteredChannels(response.data.response || []); // Initially show all channels
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // Persist favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Function to filter channels based on the active filters
  const filterChannels = () => {
    let updatedChannels = channels;

    // Apply category filter if it's not "All"
    if (categoryFilter !== "All") {
      updatedChannels = updatedChannels.filter(
        (channel) => channel.category === categoryFilter
      );
    }

    // Apply language filter if it's not "All"
    if (languageFilter !== "All") {
      updatedChannels = updatedChannels.filter(
        (channel) => channel.language === languageFilter
      );
    }

    // Apply HD filter
    if (isHD) {
      updatedChannels = updatedChannels.filter((channel) =>
        channel.filters.includes("HD")
      );
    }

    // Apply search filter
    if (searchTerm) {
      updatedChannels = updatedChannels.filter(
        (channel) =>
          channel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          channel.stbNumber.includes(searchTerm)
      );
    }

    setFilteredChannels(updatedChannels);
  };

  // Re-run filter logic when any of the filter states change
  useEffect(() => {
    filterChannels();
  }, [categoryFilter, languageFilter, isHD, searchTerm, channels]);

  // Handle search functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  // Handle language filter
  const handleLanguageFilter = (language) => {
    setLanguageFilter(language);
  };

  // Toggle HD filter
  const toggleHDFilter = () => {
    setIsHD(!isHD);
  };

  const toggleFavorite = (channelId) => {
    if (favorites.includes(channelId)) {
      setFavorites(favorites.filter((id) => id !== channelId));
    } else {
      setFavorites([...favorites, channelId]);
    }
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
        <Box p={5} maxW="1280px" mx="auto">
          <Input
            placeholder="Search by name or number"
            value={searchTerm}
            onChange={handleSearch}
            mb={4}
          />
          <Box mb={4}>
            <Text fontWeight="bold" mb={2}>
              HD Only
            </Text>
            <Checkbox isChecked={isHD} onChange={toggleHDFilter} />
          </Box>

          {/* Category Filter */}
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

          {/* Language Filter */}
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

          <Grid
            templateColumns={{
              base: "1fr", // 1 card per row on mobile
              sm: "1fr", // 1 card per row on small screens
              md: "repeat(2, 1fr)", // 2 cards per row on medium screens
              lg: "repeat(3, 1fr)", // 3 cards per row on large screens
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
        </Box>
      )}
    </>
  );
};

export default ContentGuide;
