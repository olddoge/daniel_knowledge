/**
 * Sets up Justified Gallery.
 */
if (!!$.prototype.justifiedGallery) {
  var options = {
    rowHeight: 140,
    margins: 4,
    lastRow: "justify"
  };
  $(".article-gallery").justifiedGallery(options);
}

$(document).ready(function() {

  function getTranslation(translations, key) {
    var parts = key.split(".");
    var value = translations;
    for (var i = 0; i < parts.length; i++) {
      if (!value || typeof value[parts[i]] === "undefined") {
        return null;
      }
      value = value[parts[i]];
    }
    return value;
  }

  function formatTranslation(text, args) {
    if (!args || !args.length) {
      return text;
    }
    var index = 0;
    return text.replace(/%[sd]/g, function() {
      return typeof args[index] === "undefined" ? "" : args[index++];
    });
  }

  function parseI18nArgs(value) {
    if (!value) {
      return [];
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      return String(value).split(",");
    }
  }

  function getPluralTranslation(translations, key, count) {
    var plural = getTranslation(translations, key);
    if (!plural) {
      return null;
    }
    if (Number(count) === 0 && typeof plural.zero !== "undefined") {
      return plural.zero;
    }
    if (Number(count) === 1 && typeof plural.one !== "undefined") {
      return plural.one;
    }
    return plural.other || plural.one || plural.zero || null;
  }

  function setupLanguageSwitcher() {
    var settings = window.CACTUS_LANGUAGE_SWITCHER;
    if (!settings || !settings.languages) {
      return;
    }

    var storageKey = "cactus-language";
    var fallback = settings.defaultLanguage || settings.currentLanguage;
    var storedLanguage = window.localStorage ? localStorage.getItem(storageKey) : null;
    var currentLanguage = settings.languages[storedLanguage] ? storedLanguage : fallback;

    function translate(key, args, language) {
      var translations = settings.languages[language || currentLanguage];
      if (!translations) {
        return null;
      }
      var text = getTranslation(translations, key);
      return text ? formatTranslation(text, args) : null;
    }

    window.CACTUS_TRANSLATE = translate;

    function applyLanguage(language) {
      var translations = settings.languages[language];
      if (!translations) {
        return;
      }
      currentLanguage = language;

      $("[data-i18n]").each(function() {
        var text = translate($(this).data("i18n"), parseI18nArgs($(this).attr("data-i18n-args")));
        if (text) {
          $(this).text(text);
        }
      });

      $("[data-i18n-plural]").each(function() {
        var count = $(this).attr("data-i18n-count");
        var text = getPluralTranslation(translations, $(this).data("i18n-plural"), count);
        if (text !== null) {
          $(this).text(formatTranslation(text, [count]));
        }
      });

      $("[data-i18n-attr]").each(function() {
        var element = $(this);
        var pairs = element.attr("data-i18n-attr").split(",");
        pairs.forEach(function(pair) {
          var parts = pair.split(":");
          var attr = parts[0];
          var key = parts[1];
          var text = translate(key, parseI18nArgs(element.attr("data-i18n-args")));
          if (attr && text) {
            element.attr(attr, text);
          }
        });
      });

      $("[data-language-current]").text(translations.label || language);
      $("[data-language-option]").removeClass("active");
      $('[data-language-option="' + language + '"]').addClass("active");
      $("html").attr("lang", language.substring(0, 2));

      if (window.localStorage) {
        localStorage.setItem(storageKey, language);
      }
    }

    applyLanguage(currentLanguage);

    $(".language-switcher-toggle").click(function(event) {
      event.preventDefault();
      event.stopPropagation();
      var switcher = $(this).closest(".language-switcher");
      var isOpen = switcher.toggleClass("open").hasClass("open");
      $(this).attr("aria-expanded", isOpen ? "true" : "false");
    });

    $("[data-language-option]").click(function(event) {
      event.preventDefault();
      applyLanguage($(this).data("language-option"));
      $(".language-switcher").removeClass("open");
      $(".language-switcher-toggle").attr("aria-expanded", "false");
    });

    $(document).click(function() {
      $(".language-switcher").removeClass("open");
      $(".language-switcher-toggle").attr("aria-expanded", "false");
    });
  }

  setupLanguageSwitcher();

  /**
   * Shows the responsive navigation menu on mobile.
   */
  $("#header > #nav > ul > .icon").click(function() {
    $("#header > #nav > ul").toggleClass("responsive");
  });


  /**
   * Controls the different versions of  the menu in blog post articles 
   * for Desktop, tablet and mobile.
   */
  if ($(".post").length) {
    var menu = $("#menu");
    var nav = $("#menu > #nav");
    var menuIcon = $("#menu-icon, #menu-icon-tablet");

    /**
     * Display the menu on hi-res laptops and desktops.
     */
    if ($(document).width() >= 1440) {
      menu.show();
      menuIcon.addClass("active");
    }

    /**
     * Display the menu if the menu icon is clicked.
     */
    menuIcon.click(function() {
      if (menu.is(":hidden")) {
        menu.show();
        menuIcon.addClass("active");
      } else {
        menu.hide();
        menuIcon.removeClass("active");
      }
      return false;
    });

    /**
     * Add a scroll listener to the menu to hide/show the navigation links.
     */
    if (menu.length) {
      $(window).on("scroll", function() {
        var topDistance = menu.offset().top;

        // hide only the navigation links on desktop
        if (!nav.is(":visible") && topDistance < 50) {
          nav.show();
        } else if (nav.is(":visible") && topDistance > 100) {
          nav.hide();
        }

        // on tablet, hide the navigation icon as well and show a "scroll to top
        // icon" instead
        if ( ! $( "#menu-icon" ).is(":visible") && topDistance < 50 ) {
          $("#menu-icon-tablet").show();
          $("#top-icon-tablet").hide();
        } else if (! $( "#menu-icon" ).is(":visible") && topDistance > 100) {
          $("#menu-icon-tablet").hide();
          $("#top-icon-tablet").show();
        }
      });
    }

    /**
     * Show mobile navigation menu after scrolling upwards,
     * hide it again after scrolling downwards.
     */
    if ($( "#footer-post").length) {
      var lastScrollTop = 0;
      $(window).on("scroll", function() {
        var topDistance = $(window).scrollTop();

        if (topDistance > lastScrollTop){
          // downscroll -> show menu
          $("#footer-post").hide();
        } else {
          // upscroll -> hide menu
          $("#footer-post").show();
        }
        lastScrollTop = topDistance;

        // close all submenu"s on scroll
        $("#nav-footer").hide();
        $("#toc-footer").hide();
        $("#share-footer").hide();

        // show a "navigation" icon when close to the top of the page, 
        // otherwise show a "scroll to the top" icon
        if (topDistance < 50) {
          $("#actions-footer > #top").hide();
        } else if (topDistance > 100) {
          $("#actions-footer > #top").show();
        }
      });
    }
  }
});
