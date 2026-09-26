import { LeetCodeProblem } from '../../src/types/index.ts';

export const INITIAL_LEETCODE_PROBLEMS: LeetCodeProblem[] = [
  {
    id: 'lc-1',
    number: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    tags: ['Array', 'Hash Table'],
    companies: ['Google', 'Amazon', 'Reliance Jio', 'Microsoft', 'Meta'],
    acceptanceRate: '52.8%',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        seen = {}
        for i, n in enumerate(nums):
            diff = target - n
            if diff in seen:
                return [seen[diff], i]
            seen[n] = i
        return []`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
            return [map.get(diff), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); ++i) {
            int comp = target - nums[i];
            if (mp.count(comp)) return {mp[comp], i};
            mp[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[] { map.get(comp), i };
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
    },
    solutionApproach: `### 1. Hash Table One-Pass (Optimal)
Store each element and its index in a hash map while iterating. For element \`nums[i]\`, calculate \`complement = target - nums[i]\`. If the complement exists in our map, we have found the pair!
- **Time Complexity:** O(N) where N is the length of nums.
- **Space Complexity:** O(N) to store up to N entries in the hash map.`,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    hints: [
      'A really brute force way would be to search for all possible pairs, but that takes O(n^2).',
      'Can you trade space for time? What fast lookup data structure exists?',
      'Use a hash map to remember numbers you have already visited and their indices.',
    ],
    sampleTestCases: [
      { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]' },
      { input: 'nums = [3,3], target = 6', expectedOutput: '[0,1]' },
    ],
  },
  {
    id: 'lc-20',
    number: 20,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    tags: ['String', 'Stack'],
    companies: ['Amazon', 'Google', 'Meta', 'Tata Motors', 'Microsoft'],
    acceptanceRate: '40.6%',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
      {
        input: 's = "(]"',
        output: 'false',
      },
      {
        input: 's = "([])"',
        output: 'true',
      },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    starterCode: {
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack`,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (const ch of s) {
        if (map[ch]) {
            if (stack.pop() !== map[ch]) return false;
        } else {
            stack.push(ch);
        }
    }
    return stack.length === 0;
};`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                char top = st.top();
                if ((c == ')' && top != '(') ||
                    (c == '}' && top != '{') ||
                    (c == ']' && top != '[')) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      java: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
    },
    solutionApproach: `### Stack-Based Matching
Push closing brackets corresponding to open ones or push openers onto a stack. When a closing bracket is encountered, verify it matches the most recently pushed opener.
- **Time Complexity:** O(N)
- **Space Complexity:** O(N) for the stack in worst case.`,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    hints: [
      'Use a Last-In First-Out (LIFO) stack structure.',
      'Check if the stack is completely empty at the end.',
    ],
    sampleTestCases: [
      { input: 's = "()"', expectedOutput: 'true' },
      { input: 's = "()[]{}"', expectedOutput: 'true' },
      { input: 's = "(]"', expectedOutput: 'false' },
    ],
  },
  {
    id: 'lc-121',
    number: 121,
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    category: 'Sliding Window',
    tags: ['Array', 'Dynamic Programming', 'Sliding Window'],
    companies: ['Amazon', 'Goldman Sachs', 'Google', 'Tata Motors', 'Apple'],
    acceptanceRate: '54.1%',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note buying on day 2 and selling on day 1 is not allowed.',
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.',
      },
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    starterCode: {
      python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for p in prices:
            if p < min_price:
                min_price = p
            elif p - min_price > max_profit:
                max_profit = p - min_price
        return max_profit`,
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (const p of prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
    }
    return maxProfit;
};`,
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX, maxProfit = 0;
        for (int p : prices) {
            minPrice = min(minPrice, p);
            maxProfit = max(maxProfit, p - minPrice);
        }
        return maxProfit;
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
        }
        return maxProfit;
    }
}`,
    },
    solutionApproach: `### Single Pass Tracking Minimum Price
Maintain the minimum price seen so far as you scan through the array. On each day, compute \`potential_profit = current_price - min_price\` and update \`max_profit\`.
- **Time Complexity:** O(N)
- **Space Complexity:** O(1)`,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: [
      'You cannot sell before you buy.',
      'Track the minimum price encountered so far in one loop.',
    ],
    sampleTestCases: [
      { input: 'prices = [7,1,5,3,6,4]', expectedOutput: '5' },
      { input: 'prices = [7,6,4,3,1]', expectedOutput: '0' },
    ],
  },
  {
    id: 'lc-15',
    number: 15,
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    category: 'Two Pointers',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    companies: ['Meta', 'Amazon', 'Google', 'Reliance', 'Microsoft'],
    acceptanceRate: '34.2%',
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. Distinct triplets are [-1,0,1] and [-1,-1,2].',
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
        explanation: 'The only possible triplet does not sum up to 0.',
      },
      {
        input: 'nums = [0,0,0]',
        output: '[[0,0,0]]',
      },
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5',
    ],
    starterCode: {
      python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        res = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            left, right = i + 1, len(nums) - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if total < 0:
                    left += 1
                elif total > 0:
                    right -= 1
                else:
                    res.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
        return res`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    nums.sort((a, b) => a - b);
    const res = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let l = i + 1, r = nums.length - 1;
        while (l < r) {
            const sum = nums[i] + nums[l] + nums[r];
            if (sum === 0) {
                res.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) l++;
                while (l < r && nums[r] === nums[r - 1]) r--;
                l++;
                r--;
            } else if (sum < 0) {
                l++;
            } else {
                r--;
            }
        }
    }
    return res;
};`,
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; ++i) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
}`,
    },
    solutionApproach: `### Sort and Two Pointers
Sort the array first in O(N log N). Fix the first element \`nums[i]\` and use two pointers (\`left\` and \`right\`) to find pairs that sum to \`-nums[i]\`. Skip duplicates carefully to avoid redundant triplets.
- **Time Complexity:** O(N^2)
- **Space Complexity:** O(log N) to O(N) for sorting`,
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1) auxiliary',
    hints: [
      'Sorting makes it easy to use two pointers and eliminate duplicates.',
      'Fix one number and reduce to the Two Sum problem.',
    ],
    sampleTestCases: [
      { input: 'nums = [-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,0,0]', expectedOutput: '[[0,0,0]]' },
    ],
  },
  {
    id: 'lc-3',
    number: 3,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    companies: ['Amazon', 'Google', 'Tata Motors', 'Bloomberg', 'Microsoft'],
    acceptanceRate: '34.8%',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with length 3. "pwke" is a subsequence, not a substring.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    starterCode: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_index = {}
        max_len = 0
        left = 0
        for right, ch in enumerate(s):
            if ch in char_index and char_index[ch] >= left:
                left = char_index[ch] + 1
            char_index[ch] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let map = new Map();
    let left = 0;
    let maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        const ch = s[right];
        if (map.has(ch) && map.get(ch) >= left) {
            left = map.get(ch) + 1;
        }
        map.set(ch, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
};`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        vector<int> last(256, -1);
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.size(); ++right) {
            if (last[(unsigned char)s[right]] >= left) {
                left = last[(unsigned char)s[right]] + 1;
            }
            last[(unsigned char)s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
    },
    solutionApproach: `### Sliding Window with Character Index Map
Maintain a sliding window \`[left, right]\`. Store the most recent index of each character. When a duplicate character is encountered, jump \`left\` to \`last_seen_index + 1\`.
- **Time Complexity:** O(N)
- **Space Complexity:** O(min(M, N)) where M is the charset size.`,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(M, N))',
    hints: [
      'Think of a sliding window bounded by left and right pointers.',
      'Record the latest index of each visited character.',
    ],
    sampleTestCases: [
      { input: 's = "abcabcbb"', expectedOutput: '3' },
      { input: 's = "bbbbb"', expectedOutput: '1' },
      { input: 's = "pwwkew"', expectedOutput: '3' },
    ],
  },
  {
    id: 'lc-146',
    number: 146,
    title: 'LRU Cache',
    slug: 'lru-cache',
    difficulty: 'Medium',
    category: 'System Design',
    tags: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'],
    companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],
    acceptanceRate: '42.1%',
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict** the least recently used key.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        explanation: 'LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache: {1=1}\nlRUCache.put(2, 2); // cache: {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // evicts key 2, cache: {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // evicts key 1, cache: {4=4, 3=3}\nlRUCache.get(1);    // return -1\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    starterCode: {
      python: `class Node:
    def __init__(self, key, val):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {} # key -> node
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        prev, nxt = node.prev, node.next
        prev.next, nxt.prev = nxt, prev

    def _add(self, node):
        nxt = self.head.next
        self.head.next = node
        node.prev = self.head
        node.next = nxt
        nxt.prev = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add(node)
        self.cache[key] = node
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`,
      javascript: `class Node {
    constructor(key, val) {
        this.key = key;
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

var LRUCache = function(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
};

LRUCache.prototype.get = function(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._add(node);
    return node.val;
};

LRUCache.prototype.put = function(key, value) {
    if (this.map.has(key)) {
        this._remove(this.map.get(key));
    }
    const node = new Node(key, value);
    this._add(node);
    this.map.set(key, node);
    if (this.map.size > this.capacity) {
        const lru = this.tail.prev;
        this._remove(lru);
        this.map.delete(lru.key);
    }
};

LRUCache.prototype._remove = function(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
};

LRUCache.prototype._add = function(node) {
    const next = this.head.next;
    this.head.next = node;
    node.prev = this.head;
    node.next = next;
    next.prev = node;
};`,
      cpp: `class LRUCache {
    int cap;
    list<pair<int, int>> dll;
    unordered_map<int, list<pair<int, int>>::iterator> mp;
public:
    LRUCache(int capacity) : cap(capacity) {}
    
    int get(int key) {
        if (!mp.count(key)) return -1;
        dll.splice(dll.begin(), dll, mp[key]);
        return mp[key]->second;
    }
    
    void put(int key, int value) {
        if (mp.count(key)) {
            mp[key]->second = value;
            dll.splice(dll.begin(), dll, mp[key]);
            return;
        }
        if (dll.size() == cap) {
            mp.erase(dll.back().first);
            dll.pop_back();
        }
        dll.emplace_front(key, value);
        mp[key] = dll.begin();
    }
};`,
      java: `class LRUCache {
    class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }
    private int cap;
    private Map<Integer, Node> map = new HashMap<>();
    private Node head = new Node(0, 0), tail = new Node(0, 0);

    public LRUCache(int capacity) {
        this.cap = capacity;
        head.next = tail;
        tail.prev = head;
    }
    
    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node);
        add(node);
        return node.val;
    }
    
    public void put(int key, int value) {
        if (map.containsKey(key)) remove(map.get(key));
        Node node = new Node(key, value);
        add(node);
        map.put(key, node);
        if (map.size() > cap) {
            Node lru = tail.prev;
            remove(lru);
            map.remove(lru.key);
        }
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void add(Node node) {
        Node next = head.next;
        head.next = node;
        node.prev = head;
        node.next = next;
        next.prev = node;
    }
}`,
    },
    solutionApproach: `### Doubly-Linked List + Hash Map
A doubly-linked list allows O(1) removal and insertion of nodes. A hash map provides O(1) lookup from key to linked list node. The head represents the Most Recently Used, and the tail is the Least Recently Used (LRU) element.
- **Time Complexity:** O(1) for both get and put
- **Space Complexity:** O(capacity)`,
    timeComplexity: 'O(1) amortized',
    spaceComplexity: 'O(capacity)',
    hints: [
      'How can you achieve O(1) lookup AND O(1) eviction of the oldest element?',
      'Combine a Hash Map with a Doubly-Linked List.',
    ],
    sampleTestCases: [
      { input: 'capacity = 2, put(1, 1), put(2, 2), get(1)', expectedOutput: '1' },
      { input: 'put(3, 3), get(2)', expectedOutput: '-1' },
    ],
  },
  {
    id: 'lc-200',
    number: 200,
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    category: 'Trees & Graphs',
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Bloomberg', 'Uber'],
    acceptanceRate: '58.3%',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: '1',
      },
      {
        input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: '3',
      },
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.',
    ],
    starterCode: {
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid:
            return 0
        m, n = len(grid), len(grid[0])
        count = 0

        def dfs(r, c):
            if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1':
                return
            grid[r][c] = '0' # mark visited
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    count += 1
                    dfs(i, j)
        return count`,
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {
    if (!grid.length) return 0;
    const m = grid.length, n = grid[0].length;
    let count = 0;

    function dfs(r, c) {
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;
        grid[r][c] = '0';
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                count++;
                dfs(i, j);
            }
        }
    }
    return count;
};`,
      cpp: `class Solution {
public:
    void dfs(vector<vector<char>>& grid, int r, int c) {
        int m = grid.size(), n = grid[0].size();
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }

    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int i = 0; i < grid.size(); ++i) {
            for (int j = 0; j < grid[0].size(); ++j) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        return count;
    }
};`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        return count;
    }

    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}`,
    },
    solutionApproach: `### Connected Components via DFS / BFS
Iterate through each cell. When finding a \`'1'\`, increment our island count and trigger a recursive DFS or queue-based BFS to sink the entire connected island (marking cells as \`'0'\` or visited).
- **Time Complexity:** O(M * N)
- **Space Complexity:** O(M * N) in worst case recursion stack.`,
    timeComplexity: 'O(M * N)',
    spaceComplexity: 'O(M * N)',
    hints: [
      'Treat the 2D grid as an unweighted undirected graph.',
      'Sinking visited land to 0 avoids extra memory for a visited set.',
    ],
    sampleTestCases: [
      { input: 'grid 4x5 with 1 island', expectedOutput: '1' },
      { input: 'grid 4x5 with 3 islands', expectedOutput: '3' },
    ],
  },
  {
    id: 'lc-704',
    number: 704,
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    category: 'Binary Search',
    tags: ['Array', 'Binary Search'],
    companies: ['Google', 'Microsoft', 'Apple', 'Reliance Jio', 'Amazon'],
    acceptanceRate: '57.4%',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4',
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    starterCode: {
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        low, high = 0, len(nums) - 1
        while low <= high:
            mid = (low + high) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
        return -1`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let low = 0, high = nums.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
};`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    }
}`,
    },
    solutionApproach: `### Classic Divide and Conquer
Calculate \`mid = (low + high) / 2\`. Compare \`nums[mid]\` with \`target\`. Half the search space is eliminated on each step.
- **Time Complexity:** O(log N)
- **Space Complexity:** O(1)`,
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    hints: [
      'Since the array is sorted, eliminate half the elements in each step.',
      'Prevent integer overflow with low + (high - low) / 2.',
    ],
    sampleTestCases: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', expectedOutput: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', expectedOutput: '-1' },
    ],
  },
  {
    id: 'lc-core-sensor',
    number: 991,
    title: 'Industrial Sensor Moving Window Filter',
    slug: 'sensor-moving-window-filter',
    difficulty: 'Medium',
    category: 'Core Engineering Algorithms',
    tags: ['Sliding Window', 'Queue', 'IoT & Embedded', 'Plant Telemetry', 'Signal Processing'],
    companies: ['Reliance Industries', 'Tata Motors', 'L&T Technology Services', 'Siemens', 'Honeywell'],
    acceptanceRate: '61.5%',
    description: `In refinery and manufacturing telemetry, sensors capture noisy high-frequency analog pressure & temperature readings. Sudden transient spikes (e.g., valve chatter or electrical noise) must be filtered before feeding into closed-loop PID control loops.

You are given an array of sensor floats \`readings\` and a positive window size \`k\`.

Calculate the **filtered moving average** for every sliding window of size \`k\`. If a reading inside the window deviates from the current window's raw average by more than \`threshold\`, replace that reading with the window median before computing the final filtered output.

Return an array containing the filtered smoothed averages rounded to 2 decimal places.`,
    examples: [
      {
        input: 'readings = [10.2, 10.5, 10.1, 45.0, 10.3, 10.4], k = 3, threshold = 15.0',
        output: '[10.27, 10.37, 10.30, 10.40]',
        explanation: 'When 45.0 enters the window [10.1, 45.0, 10.3], its deviation exceeds threshold 15.0. It is clamped to median 10.3, yielding filtered average 10.30.',
      },
    ],
    constraints: [
      '1 <= readings.length <= 10^5',
      '1 <= k <= readings.length',
      'threshold >= 0.1',
    ],
    starterCode: {
      python: `class Solution:
    def smoothSensorReadings(self, readings: list[float], k: int, threshold: float) -> list[float]:
        # Implement moving window filter with spike clipping
        res = []
        for i in range(len(readings) - k + 1):
            window = list(readings[i:i+k])
            raw_avg = sum(window) / k
            med = sorted(window)[k // 2]
            clamped = [med if abs(x - raw_avg) > threshold else x for x in window]
            res.append(round(sum(clamped) / k, 2))
        return res`,
      javascript: `/**
 * @param {number[]} readings
 * @param {number} k
 * @param {number} threshold
 * @return {number[]}
 */
var smoothSensorReadings = function(readings, k, threshold) {
    const res = [];
    for (let i = 0; i <= readings.length - k; i++) {
        const window = readings.slice(i, i + k);
        const rawAvg = window.reduce((a, b) => a + b, 0) / k;
        const sorted = [...window].sort((a, b) => a - b);
        const med = sorted[Math.floor(k / 2)];
        const clamped = window.map(x => Math.abs(x - rawAvg) > threshold ? med : x);
        const avg = clamped.reduce((a, b) => a + b, 0) / k;
        res.push(Number(avg.toFixed(2)));
    }
    return res;
};`,
      cpp: `class Solution {
public:
    vector<double> smoothSensorReadings(vector<double>& readings, int k, double threshold) {
        vector<double> res;
        for (int i = 0; i <= (int)readings.size() - k; ++i) {
            vector<double> win(readings.begin() + i, readings.begin() + i + k);
            double sum = 0;
            for (double v : win) sum += v;
            double rawAvg = sum / k;
            vector<double> sortedWin = win;
            sort(sortedWin.begin(), sortedWin.end());
            double med = sortedWin[k / 2];
            double clampedSum = 0;
            for (double v : win) {
                clampedSum += (abs(v - rawAvg) > threshold) ? med : v;
            }
            res.push_back(round((clampedSum / k) * 100.0) / 100.0);
        }
        return res;
    }
};`,
      java: `class Solution {
    public double[] smoothSensorReadings(double[] readings, int k, double threshold) {
        int n = readings.length - k + 1;
        double[] res = new double[n];
        for (int i = 0; i < n; i++) {
            double sum = 0;
            double[] win = new double[k];
            for (int j = 0; j < k; j++) {
                win[j] = readings[i + j];
                sum += win[j];
            }
            double rawAvg = sum / k;
            double[] sorted = win.clone();
            Arrays.sort(sorted);
            double med = sorted[k / 2];
            double clampedSum = 0;
            for (double v : win) {
                clampedSum += Math.abs(v - rawAvg) > threshold ? med : v;
            }
            res[i] = Math.round((clampedSum / k) * 100.0) / 100.0;
        }
        return res;
    }
}`,
    },
    solutionApproach: `### Industrial Moving Window Median Clamping
This problem bridges standard sliding windows with plant DCS/SCADA safety filters. For each \`k\`-sized telemetry window:
1. Compute the rolling sum and raw arithmetic mean.
2. Find the window median to isolate non-linear sensor transient spikes.
3. Replace deviant outliers exceeding \`threshold\` with the median value.
- **Time Complexity:** O(N * k log k) or O(N log k) with order-statistic tree/two heaps.
- **Space Complexity:** O(k)`,
    timeComplexity: 'O(N * k)',
    spaceComplexity: 'O(k)',
    hints: [
      'In high-noise environments, median filters remove impulsive noise while preserving true edges.',
      'Check if each point deviates from raw average by more than threshold.',
    ],
    sampleTestCases: [
      { input: 'readings = [10.2, 10.5, 10.1, 45.0, 10.3, 10.4], k = 3, threshold = 15.0', expectedOutput: '[10.27, 10.37, 10.30, 10.40]' },
    ],
  },
  {
    id: 'lc-322',
    number: 322,
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Goldman Sachs'],
    acceptanceRate: '43.2%',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1',
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0',
      },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    starterCode: {
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for coin in coins:
            for x in range(coin, amount + 1):
                dp[x] = min(dp[x], dp[x - coin] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`,
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (const coin of coins) {
        for (let x = coin; x <= amount; x++) {
            dp[x] = Math.min(dp[x], dp[x - coin] + 1);
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
};`,
      cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int coin : coins) {
            for (int x = coin; x <= amount; ++x) {
                dp[x] = min(dp[x], dp[x - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int coin : coins) {
            for (int x = coin; x <= amount; x++) {
                dp[x] = Math.min(dp[x], dp[x - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    },
    solutionApproach: `### Bottom-Up Dynamic Programming (Knapsack Variant)
Define \`dp[x]\` as the minimum coins needed to make amount \`x\`. Initialize \`dp[0] = 0\` and all other values to infinity. For each coin, update \`dp[x] = min(dp[x], dp[x - coin] + 1)\`.
- **Time Complexity:** O(amount * len(coins))
- **Space Complexity:** O(amount)`,
    timeComplexity: 'O(S * n)',
    spaceComplexity: 'O(S)',
    hints: [
      'Subproblem: what is the minimum coins needed to make amount (x - coin)?',
      'Iterate from 1 up to amount.',
    ],
    sampleTestCases: [
      { input: 'coins = [1,2,5], amount = 11', expectedOutput: '3' },
      { input: 'coins = [2], amount = 3', expectedOutput: '-1' },
      { input: 'coins = [1], amount = 0', expectedOutput: '0' },
    ],
  },
  {
    id: 'lc-56',
    number: 56,
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'Medium',
    category: 'Two Pointers',
    tags: ['Array', 'Sorting'],
    companies: ['Google', 'Microsoft', 'Meta', 'Amazon', 'Reliance'],
    acceptanceRate: '46.7%',
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.',
      },
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4',
    ],
    starterCode: {
      python: `class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort(key=lambda x: x[0])
        merged = []
        for interval in intervals:
            if not merged or merged[-1][1] < interval[0]:
                merged.append(interval)
            else:
                merged[-1][1] = max(merged[-1][1], interval[1])
        return merged`,
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    if (!intervals.length) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const last = merged[merged.length - 1];
        const curr = intervals[i];
        if (curr[0] <= last[1]) {
            last[1] = Math.max(last[1], curr[1]);
        } else {
            merged.push(curr);
        }
    }
    return merged;
};`,
      cpp: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> merged;
        merged.push_back(intervals[0]);
        for (size_t i = 1; i < intervals.size(); ++i) {
            if (intervals[i][0] <= merged.back()[1]) {
                merged.back()[1] = max(merged.back()[1], intervals[i][1]);
            } else {
                merged.push_back(intervals[i]);
            }
        }
        return merged;
    }
};`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> result = new ArrayList<>();
        int[] current = intervals[0];
        result.add(current);
        for (int[] interval : intervals) {
            if (interval[0] <= current[1]) {
                current[1] = Math.max(current[1], interval[1]);
            } else {
                current = interval;
                result.add(current);
            }
        }
        return result.toArray(new int[result.size()][]);
    }
}`,
    },
    solutionApproach: `### Sort by Start Time and Merge
Sort intervals by their starting boundary. Keep the current active interval. If the next interval starts on or before the current interval's end, merge them by setting \`end = max(end, next_end)\`. Otherwise, push the new interval into our result list.
- **Time Complexity:** O(N log N)
- **Space Complexity:** O(log N) or O(N) for sort`,
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    hints: [
      'Sorting intervals by start time turns this into a linear scan.',
      'Check if current[0] <= last[1].',
    ],
    sampleTestCases: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: 'intervals = [[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
    ],
  },
];
