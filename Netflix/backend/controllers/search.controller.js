import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function searchPerson(req, res) {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );
    if (response.results.length === 0) {
      return res.status(404).json(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: { searchHistory: { id: response.results[0].id,
        image: response.results[0].profile_path,
        title: response.results[0].name,
        searchType: "person",
        createdAt: new Date(),
       } },
    });
    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function searchMovie(req, res) {
    const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
        `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
      );
      if (response.results.length === 0) {
        return res.status(404).json(null);
      }

      await User.findByIdAndUpdate(req.user._id, {
        $push: { searchHistory: { id: response.results[0].id,
          image: response.results[0].profile_path,
          title: response.results[0].name,
          searchType: "movie",
          createdAt: new Date(),
         } },
      });
    res.status(200).json({ success: true, content: response.results });
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
}
export async function searchTv(req, res) {
    const { query } = req.params;
    try {
      const response = await fetchFromTMDB(
          `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
        );
        if (response.results.length === 0) {
         return res.status(404).json(null);
        }
  
        await User.findByIdAndUpdate(req.user._id, {
          $push: { searchHistory: { id: response.results[0].id,
            image: response.results[0].poster_path,
            title: response.results[0].name,
            searchType: "tv",
            createdAt: new Date(),
           } },
        });
      res.status(200).json({ success: true, content: response.results });
    } catch (error) {

      res.status(500).json({ message: error.message });
    }
}

export async function getSearchHistory(req, res) {
    try {
        res.status(200).json({ success: true, content: req.user.searchHistory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function removeItemFromSearchHistory(req, res) {
    let { id } = req.params;
    id = parseInt(id);
    
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { searchHistory: { id: id } },
        })


        res.status(200).json({ success: true, message: "Item removed from search history" });
    } catch (error) {

        res.status(500).json({ success: false, message: error.message });
    }
}