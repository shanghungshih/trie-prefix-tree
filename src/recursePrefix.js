import config from './config';

// sort items as they're being found
// to prevent slow .sort() in NodeJs
const pushInOrder = function(word, prefixes) {
  let i = 0;

  while(i < prefixes.length) {
    if(word < prefixes[i]) {
      break;
    }
    i += 1;
  }

  prefixes.splice(i, 0, word);

  return prefixes;
};

export default function recursePrefix(
    node, prefix, sorted, limit, prefixes = []
  ) {
  // stop when limit is reached
  if(limit && prefixes.length === limit) return prefixes;

  let word = prefix;

  for(const branch of node.keys()) {
    // stop when limit is reached
    if(limit && prefixes.length === limit) return prefixes;

    let currentLetter = branch;
    if(branch === config.END_WORD && typeof node.get(branch) === 'number') {
      if(sorted) {
        pushInOrder(word, prefixes);
      } else {
        prefixes.push(word);
      }
      word = '';
      continue;
    } else if(branch === config.END_WORD_REPLACER) {
      currentLetter = config.END_WORD;
    }
    // if limit not used, traverse using DFS
    if(!limit) {
      recursePrefix(
        node.get(branch), prefix + currentLetter, sorted, limit, prefixes
      );
    }
  }

  // For performance purpose, if limit used, traverse using BFS
  if(limit) {
    for(const branch of node.keys()) {
      let currentLetter = branch;
      if(branch === config.END_WORD && typeof node.get(branch) === 'number') {
        continue;
      } else if(branch === config.END_WORD_REPLACER) {
        currentLetter = config.END_WORD;
      }
      recursePrefix(
        node.get(branch), prefix + currentLetter, sorted, limit, prefixes
      );
    }
  }

  return prefixes;
}
