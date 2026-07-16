var fs = require("fs");
var path = require("path");
var yaml = require("js-yaml");

function normalizeLanguage(language) {
  if (Array.isArray(language)) {
    return language[0];
  }
  return language;
}

function readLanguageFile(themeDir, language) {
  var file = path.join(themeDir, "languages", language + ".yml");
  if (!fs.existsSync(file)) {
    return {};
  }
  return yaml.load(fs.readFileSync(file, "utf8")) || {};
}

hexo.extend.helper.register("language_switcher_data", function () {
  var switcher = hexo.theme.config.language_switcher || {};
  var configuredLanguages = switcher.languages || {};
  var currentLanguage = normalizeLanguage(this.config.language) || switcher.default || "en";
  var defaultLanguage = switcher.default || currentLanguage;
  var languages = {};

  Object.keys(configuredLanguages).forEach(function (language) {
    var option = configuredLanguages[language] || {};
    var translations = readLanguageFile(hexo.theme_dir, language);
    translations.label = option.label || translations.label || language;
    languages[language] = translations;
  });

  if (!languages[currentLanguage]) {
    currentLanguage = defaultLanguage;
  }

  return {
    defaultLanguage: defaultLanguage,
    currentLanguage: currentLanguage,
    languages: languages
  };
});
