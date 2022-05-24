import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai";
// styles
import "./style.css";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [fetching, setFetching] = useState(false);
  const [results, setResults] = useState(null);
  const BaseURL = "https://wiki.saurabhv749.repl.co/api";

  const getResults = () => {
    if (query.length)
      axios.get(BaseURL + "/search?query=" + query).then((res) => {
        setResults(res.data.data);
      });
  };

  const getText = (markup) => {
    let div = document.createElement("div");
    div.innerHTML = markup;
    let text = div.textContent || div.innerText || "";
    return text;
  };

  const openPage = (e, random) => {
    setFetching(true);
    let url =
      BaseURL +
      (random ? "/page/random" : "/page?title=" + e.target.textContent);
    axios.get(url).then((res) => {
      let div = document.createElement("div");
      div.innerHTML = res.data.data;
      let wikiPage = document.querySelector("#wiki-page");
      wikiPage.children[1] && wikiPage.removeChild(wikiPage.children[1]);
      wikiPage.appendChild(div);
      wikiPage.classList.replace("hide", "show");
      setFetching(false);
    });
  };

  const collapse = () => {
    document.querySelector("#wiki-page").classList.replace("show", "hide");
  };

  const handleInput = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="container">
      <main>
        <section
          style={{
            opacity: fetching ? 0.5 : 1,
            pointerEvents: fetching ? "none" : "auto",
          }}
        >
          <header>
            <input
              type="text"
              placeholder="Search...."
              id="search-box"
              name="search-box"
              value={query}
              autoComplete="off"
              autoFocus
              onChange={handleInput}
              onKeyPress={(e) => {
                if (e.key === "Enter") getResults();
                return;
              }}
            />
            <button
              onClick={(e) => openPage(e, true)}
              className="btn"
              title="Random"
            >
              Random
            </button>
          </header>
          <div className="tags">
            {results &&
              results.map((r, i) => {
                return (
                  <div key={i} className="tag">
                    <p
                      onClick={openPage}
                      data-info={getText(r.snippet)}
                      className="tag-label"
                    >
                      {r.title}
                    </p>
                  </div>
                );
              })}
          </div>
        </section>
        <footer>
          designed with <AiOutlineHeart />
        </footer>
      </main>
      <div id="wiki-page" className="hide">
        <header>
          <button onClick={collapse}>
            <AiOutlineClose size={30} />
          </button>
        </header>
        <div className="page"></div>
      </div>
    </div>
  );
};

let renderer = createRoot(document.getElementById("root"));
renderer.render(<SearchPage />);
