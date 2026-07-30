const j=["loop","condition","array","string","function"],R={modules:j},A=[{id:"missing_semicolon",category:"syntax",description:"语句末尾缺少分号",applicable_languages:["Java","C++","JavaScript"],example_buggy:"int x = 10",example_fixed:"int x = 10;"},{id:"undefined_variable",category:"syntax",description:"使用未定义的变量",applicable_languages:["Java","Python","C++","JavaScript"],example_buggy:"System.out.println(name);",example_fixed:`String name = "test";
System.out.println(name);`},{id:"loop_boundary_off_by_one",category:"boundary",description:"循环边界错误（差一错误）",applicable_languages:["Java","Python","C++","JavaScript"],example_buggy:"for (int i = 0; i <= arr.length; i++)",example_fixed:"for (int i = 0; i < arr.length; i++)"},{id:"comparison_logic_error",category:"logic",description:"大小于逻辑判断错误",applicable_languages:["Java","Python","C++","JavaScript"],example_buggy:"if (a > b) { return b; }",example_fixed:"if (a > b) { return a; }"},{id:"missing_braces",category:"syntax",description:"if/for/while 缺少花括号",applicable_languages:["Java","C++","JavaScript"],example_buggy:`if (x > 0)
    System.out.println(x);`,example_fixed:`if (x > 0) {
    System.out.println(x);
}`},{id:"wrong_operator",category:"logic",description:"赋值与比较运算符混用",applicable_languages:["Java","C++","JavaScript"],example_buggy:"if (x = 10)",example_fixed:"if (x == 10)"},{id:"index_out_of_bounds",category:"boundary",description:"数组/列表越界访问",applicable_languages:["Java","Python","C++","JavaScript"],example_buggy:"arr[arr.length]",example_fixed:"arr[arr.length - 1]"},{id:"infinite_loop",category:"logic",description:"循环条件永远为真",applicable_languages:["Java","Python","C++","JavaScript"],example_buggy:"while (true) { i++; }",example_fixed:"while (i < 10) { i++; }"}],C={patterns:A},L=[{id:"variable_name",description:"变量名填空",difficulty:"easy",example:"int ___ = 10;"},{id:"condition",description:"判断条件填空",difficulty:"medium",example:"if (x ___ 0)"},{id:"function_param",description:"函数入参填空",difficulty:"medium",example:"public int sum(int a, ___ b)"},{id:"method_name",description:"方法名填空",difficulty:"easy",example:"public void ___()"},{id:"loop_condition",description:"循环条件填空",difficulty:"medium",example:"for (int i = 0; i ___; i++)"},{id:"return_value",description:"返回值填空",difficulty:"hard",example:"return ___;"},{id:"operator",description:"运算符填空",difficulty:"medium",example:"int result = a ___ b;"},{id:"array_index",description:"数组索引填空",difficulty:"hard",example:"arr[___]"}],k={blank_positions:L};function O(i,o){switch(o){case"missing_semicolon":return i.replace(/;(\s*$)/m,"$1");case"wrong_operator":return i.replace(/<([^=])/,"<=$1").replace(/>([^=])/,">=$1");case"off_by_one":return i.replace(/<\s*(\w+)/,"<= $1");case"wrong_braces":return i.replace(/\{\s*\n/g,`
`).replace(/\n\s*\}/g,"");case"missing_return":return i.replace(/return\s+/,"");case"wrong_variable":return i.replace(/\b(\w+)\b/,t=>`${t}_wrong`);default:return i}}const H="Java",I="loop",q=[{id:"java_loop_001",type:"copy",difficulty:1,code:`for (int i = 0; i < 5; i++) {
    System.out.println(i);
}`,explanation:"基础for循环"},{id:"java_loop_002",type:"copy",difficulty:1,code:`int sum = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
}
System.out.println("Sum: " + sum);`,explanation:"累加求和"},{id:"java_loop_003",type:"copy",difficulty:2,code:`int[] arr = {64, 34, 25, 12, 22, 11, 90};
for (int i = 0; i < arr.length - 1; i++) {
    for (int j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
            int temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
        }
    }
}`,explanation:"冒泡排序算法"},{id:"java_loop_004",type:"copy",difficulty:2,code:`public static boolean isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i <= Math.sqrt(n); i++) {
        if (n % i == 0) {
            return false;
        }
    }
    return true;
}`,explanation:"素数判断函数"},{id:"java_loop_005",type:"copy",difficulty:3,code:`public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    throw new IllegalArgumentException("No solution");
}`,explanation:"两数之和 - 哈希表解法"},{id:"java_loop_006",type:"copy",difficulty:3,code:`public static String longestCommonPrefix(String[] strs) {
    if (strs == null || strs.length == 0) return "";
    String prefix = strs[0];
    for (int i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) != 0) {
            prefix = prefix.substring(0, prefix.length() - 1);
            if (prefix.isEmpty()) return "";
        }
    }
    return prefix;
}`,explanation:"最长公共前缀"},{id:"java_loop_007",type:"copy",difficulty:2,code:`public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,explanation:"二分查找算法"},{id:"java_loop_008",type:"copy",difficulty:3,code:`public static List<List<Integer>> threeSum(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    Arrays.sort(nums);
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++; right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return result;
}`,explanation:"三数之和 - 双指针解法"},{id:"java_loop_009",type:"copy",difficulty:2,code:`public static void rotate(int[] nums, int k) {
    k = k % nums.length;
    reverse(nums, 0, nums.length - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, nums.length - 1);
}

private static void reverse(int[] nums, int start, int end) {
    while (start < end) {
        int temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp;
        start++;
        end--;
    }
}`,explanation:"轮转数组 - 三次翻转法"},{id:"java_loop_010",type:"copy",difficulty:3,code:`public static int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> map = new HashMap<>();
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (map.containsKey(c)) {
            left = Math.max(left, map.get(c) + 1);
        }
        map.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,explanation:"无重复字符的最长子串 - 滑动窗口"},{id:"java_loop_011",type:"copy",difficulty:1,code:`int n = 10;
int a = 0, b = 1;
for (int i = 0; i < n; i++) {
    System.out.print(a + " ");
    int temp = a + b;
    a = b;
    b = temp;
}`,explanation:"斐波那契数列"},{id:"java_loop_012",type:"copy",difficulty:2,code:`public static int climbStairs(int n) {
    if (n <= 2) return n;
    int prev1 = 2, prev2 = 1;
    for (int i = 3; i <= n; i++) {
        int current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}`,explanation:"爬楼梯 - 动态规划"},{id:"java_loop_013",type:"copy",difficulty:3,code:`public static List<String> generateParenthesis(int n) {
    List<String> result = new ArrayList<>();
    backtrack(result, "", 0, 0, n);
    return result;
}

private static void backtrack(List<String> result, String current, int open, int close, int max) {
    if (current.length() == max * 2) {
        result.add(current);
        return;
    }
    if (open < max) {
        backtrack(result, current + "(", open + 1, close, max);
    }
    if (close < open) {
        backtrack(result, current + ")", open, close + 1, max);
    }
}`,explanation:"括号生成 - 回溯算法"},{id:"java_loop_014",type:"copy",difficulty:2,code:`public static int maxSubArray(int[] nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}`,explanation:"最大子数组和 - Kadane算法"},{id:"java_loop_015",type:"copy",difficulty:3,code:`public static boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');
        else if (c == '[') stack.push(']');
        else if (c == '{') stack.push('}');
        else if (stack.isEmpty() || stack.pop() != c) {
            return false;
        }
    }
    return stack.isEmpty();
}`,explanation:"有效的括号 - 栈解法"}],M={language:H,module:I,questions:q},D="Java",F="condition",W=[{id:"java_cond_001",type:"copy",difficulty:1,code:`int x = 10;
if (x > 0) {
    System.out.println("正数");
}`,explanation:"基础if判断"},{id:"java_cond_002",type:"copy",difficulty:1,code:`int score = 85;
if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}`,explanation:"if-else判断"},{id:"java_cond_003",type:"copy",difficulty:2,code:`int score = 85;
if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 80) {
    System.out.println("良好");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}`,explanation:"多分支判断"},{id:"java_cond_004",type:"copy",difficulty:2,code:`int year = 2024;
boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
System.out.println(isLeap ? "闰年" : "平年");`,explanation:"闰年判断"},{id:"java_cond_005",type:"copy",difficulty:2,code:`char ch = 'A';
if (ch >= 'A' && ch <= 'Z') {
    System.out.println("大写字母");
} else if (ch >= 'a' && ch <= 'z') {
    System.out.println("小写字母");
} else if (ch >= '0' && ch <= '9') {
    System.out.println("数字");
} else {
    System.out.println("其他");
}`,explanation:"字符类型判断"},{id:"java_cond_006",type:"copy",difficulty:2,code:`int day = 3;
switch (day) {
    case 1: System.out.println("周一"); break;
    case 2: System.out.println("周二"); break;
    case 3: System.out.println("周三"); break;
    case 4: System.out.println("周四"); break;
    case 5: System.out.println("周五"); break;
    default: System.out.println("周末");
}`,explanation:"switch-case"},{id:"java_cond_007",type:"copy",difficulty:3,code:`int a = 3, b = 4, c = 5;
if (a + b > c && a + c > b && b + c > a) {
    System.out.println("可以构成三角形");
    if (a == b && b == c) System.out.println("等边三角形");
    else if (a == b || b == c || a == c) System.out.println("等腰三角形");
    else System.out.println("普通三角形");
} else {
    System.out.println("不能构成三角形");
}`,explanation:"三角形判断"},{id:"java_cond_008",type:"copy",difficulty:3,code:`int n = 17;
boolean isPrime = n > 1;
for (int i = 2; i * i <= n; i++) {
    if (n % i == 0) {
        isPrime = false;
        break;
    }
}
System.out.println(isPrime ? "素数" : "非素数");`,explanation:"素数判断"},{id:"java_cond_009",type:"copy",difficulty:1,code:`int num = 7;
if (num % 2 == 0) {
    System.out.println("偶数");
} else {
    System.out.println("奇数");
}`,explanation:"奇偶判断"},{id:"java_cond_010",type:"copy",difficulty:2,code:`int month = 4;
switch (month) {
    case 2: System.out.println("28或29天"); break;
    case 4: case 6: case 9: case 11:
        System.out.println("30天"); break;
    default: System.out.println("31天");
}`,explanation:"月份天数"},{id:"java_cond_011",type:"copy",difficulty:3,code:`int x = 5;
String result = (x % 2 == 0) ? "偶数" : "奇数";
System.out.println(result);`,explanation:"三元运算符"},{id:"java_cond_012",type:"copy",difficulty:2,code:`int x = -5;
if (x > 0) {
    System.out.println("正数");
} else if (x < 0) {
    System.out.println("负数");
} else {
    System.out.println("零");
}`,explanation:"正负零判断"},{id:"java_cond_013",type:"copy",difficulty:3,code:`int score = 75;
char grade;
if (score >= 90) grade = 'A';
else if (score >= 80) grade = 'B';
else if (score >= 70) grade = 'C';
else if (score >= 60) grade = 'D';
else grade = 'F';
System.out.println(grade);`,explanation:"成绩等级"},{id:"java_cond_014",type:"copy",difficulty:2,code:`int a = 10, b = 20, c = 30;
int max = a;
if (b > max) max = b;
if (c > max) max = c;
System.out.println("最大值: " + max);`,explanation:"三数最大值"},{id:"java_cond_015",type:"copy",difficulty:3,code:`String password = "Abc123";
boolean hasUpper = false, hasLower = false, hasDigit = false;
for (char c : password.toCharArray()) {
    if (Character.isUpperCase(c)) hasUpper = true;
    if (Character.isLowerCase(c)) hasLower = true;
    if (Character.isDigit(c)) hasDigit = true;
}
boolean isValid = password.length() >= 8 && hasUpper && hasLower && hasDigit;
System.out.println(isValid ? "密码有效" : "密码无效");`,explanation:"密码强度验证"},{id:"java_cond_016",type:"copy",difficulty:1,code:`int age = 20;
if (age >= 18) {
    System.out.println("成年人");
} else {
    System.out.println("未成年人");
}`,explanation:"年龄判断"},{id:"java_cond_017",type:"copy",difficulty:2,code:`int num = 28;
int sum = 0;
for (int i = 1; i < num; i++) {
    if (num % i == 0) sum += i;
}
System.out.println(sum == num ? "完美数" : "非完美数");`,explanation:"完美数判断"},{id:"java_cond_018",type:"copy",difficulty:3,code:`int n = 12345;
int reversed = 0, original = n;
while (n > 0) {
    reversed = reversed * 10 + n % 10;
    n /= 10;
}
System.out.println(original == reversed ? "回文数" : "非回文数");`,explanation:"回文数判断"},{id:"java_cond_019",type:"copy",difficulty:2,code:`double bmi = 22.5;
if (bmi < 18.5) System.out.println("偏瘦");
else if (bmi < 24) System.out.println("正常");
else if (bmi < 28) System.out.println("偏胖");
else System.out.println("肥胖");`,explanation:"BMI判断"},{id:"java_cond_020",type:"copy",difficulty:3,code:`int year = 2024, month = 2, day = 29;
boolean isValid = true;
if (month < 1 || month > 12) isValid = false;
else if (day < 1) isValid = false;
else if (month == 2) {
    boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    if (day > (isLeap ? 29 : 28)) isValid = false;
} else if (Arrays.asList(4, 6, 9, 11).contains(month)) {
    if (day > 30) isValid = false;
} else {
    if (day > 31) isValid = false;
}
System.out.println(isValid ? "有效日期" : "无效日期");`,explanation:"日期验证"}],U={language:D,module:F,questions:W},P="Java",B="array",z=[{id:"java_arr_001",type:"copy",difficulty:1,code:`int[] arr = {1, 2, 3, 4, 5};
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}`,explanation:"数组遍历"},{id:"java_arr_002",type:"copy",difficulty:2,code:`public static int[] mergeSortedArrays(int[] arr1, int[] arr2) {
    int[] merged = new int[arr1.length + arr2.length];
    int i = 0, j = 0, k = 0;
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            merged[k++] = arr1[i++];
        } else {
            merged[k++] = arr2[j++];
        }
    }
    while (i < arr1.length) merged[k++] = arr1[i++];
    while (j < arr2.length) merged[k++] = arr2[j++];
    return merged;
}`,explanation:"合并两个有序数组"},{id:"java_arr_003",type:"copy",difficulty:2,code:`public static void moveZeroes(int[] nums) {
    int insertPos = 0;
    for (int num : nums) {
        if (num != 0) {
            nums[insertPos++] = num;
        }
    }
    while (insertPos < nums.length) {
        nums[insertPos++] = 0;
    }
}`,explanation:"移动零 - 双指针"},{id:"java_arr_004",type:"copy",difficulty:3,code:`public static int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int leftMax = 0, rightMax = 0;
    int water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                water += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                water += rightMax - height[right];
            }
            right--;
        }
    }
    return water;
}`,explanation:"接雨水 - 双指针"},{id:"java_arr_005",type:"copy",difficulty:2,code:`public static int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] answer = new int[n];
    answer[0] = 1;
    for (int i = 1; i < n; i++) {
        answer[i] = answer[i - 1] * nums[i - 1];
    }
    int right = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] *= right;
        right *= nums[i];
    }
    return answer;
}`,explanation:"除自身以外数组的乘积"},{id:"java_arr_006",type:"copy",difficulty:3,code:`public static int findMin(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return nums[left];
}`,explanation:"寻找旋转排序数组中的最小值"},{id:"java_arr_007",type:"copy",difficulty:2,code:`public static int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxWater = 0;
    while (left < right) {
        int water = Math.min(height[left], height[right]) * (right - left);
        maxWater = Math.max(maxWater, water);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxWater;
}`,explanation:"盛最多水的容器 - 双指针"},{id:"java_arr_008",type:"copy",difficulty:3,code:`public static List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    result.add(new ArrayList<>());
    for (int num : nums) {
        List<List<Integer>> newSubsets = new ArrayList<>();
        for (List<Integer> subset : result) {
            List<Integer> newSubset = new ArrayList<>(subset);
            newSubset.add(num);
            newSubsets.add(newSubset);
        }
        result.addAll(newSubsets);
    }
    return result;
}`,explanation:"子集 - 迭代法"},{id:"java_arr_009",type:"copy",difficulty:2,code:`public static boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int num : nums) {
        if (seen.contains(num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
}`,explanation:"存在重复元素 - 哈希集合"},{id:"java_arr_010",type:"copy",difficulty:3,code:`public static int[] maxSlidingWindow(int[] nums, int k) {
    if (nums == null || k <= 0) return new int[0];
    int n = nums.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> deque = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!deque.isEmpty() && deque.peek() < i - k + 1) {
            deque.poll();
        }
        while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
            deque.pollLast();
        }
        deque.offer(i);
        if (i >= k - 1) {
            result[i - k + 1] = nums[deque.peek()];
        }
    }
    return result;
}`,explanation:"滑动窗口最大值 - 单调队列"},{id:"java_arr_011",type:"copy",difficulty:1,code:`public static int findMax(int[] arr) {
    int max = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}`,explanation:"查找最大值"},{id:"java_arr_012",type:"copy",difficulty:2,code:`public static void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums, low++, mid++);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums, mid, high--);
        }
    }
}

private static void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}`,explanation:"颜色分类 - 荷兰国旗问题"},{id:"java_arr_013",type:"copy",difficulty:3,code:`public static int longestConsecutive(int[] nums) {
    Set<Integer> numSet = new HashSet<>();
    for (int num : nums) {
        numSet.add(num);
    }
    int maxStreak = 0;
    for (int num : numSet) {
        if (!numSet.contains(num - 1)) {
            int currentNum = num;
            int currentStreak = 1;
            while (numSet.contains(currentNum + 1)) {
                currentNum++;
                currentStreak++;
            }
            maxStreak = Math.max(maxStreak, currentStreak);
        }
    }
    return maxStreak;
}`,explanation:"最长连续序列 - 哈希集合"},{id:"java_arr_014",type:"copy",difficulty:2,code:`public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[] {};
}`,explanation:"两数之和"},{id:"java_arr_015",type:"copy",difficulty:3,code:`public static int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}`,explanation:"搜索旋转排序数组"}],f={language:P,module:B,questions:z},G="Java",V="string",Y=[{id:"java_str_001",type:"copy",difficulty:1,code:`String s = "Hello World";
System.out.println(s.length());
System.out.println(s.toUpperCase());`,explanation:"长度和大小写"},{id:"java_str_002",type:"copy",difficulty:1,code:`String s1 = "Hello";
String s2 = "World";
String s3 = s1 + " " + s2;
System.out.println(s3);`,explanation:"字符串拼接"},{id:"java_str_003",type:"copy",difficulty:2,code:`String s = "Hello World";
System.out.println(s.indexOf("World"));
System.out.println(s.contains("World"));
System.out.println(s.startsWith("Hello"));`,explanation:"查找操作"},{id:"java_str_004",type:"copy",difficulty:2,code:`String s = "Hello World";
String sub = s.substring(6);
System.out.println(sub);
String sub2 = s.substring(0, 5);
System.out.println(sub2);`,explanation:"截取子串"},{id:"java_str_005",type:"copy",difficulty:2,code:`String s = "Hello World";
String replaced = s.replace("World", "Java");
System.out.println(replaced);`,explanation:"字符串替换"},{id:"java_str_006",type:"copy",difficulty:2,code:`String s = "  Hello World  ";
System.out.println(s.trim());
System.out.println(s.strip());`,explanation:"去除空格"},{id:"java_str_007",type:"copy",difficulty:3,code:`String s = "Hello World";
char[] chars = s.toCharArray();
for (int i = 0; i < chars.length / 2; i++) {
    char temp = chars[i];
    chars[i] = chars[chars.length - 1 - i];
    chars[chars.length - 1 - i] = temp;
}
System.out.println(new String(chars));`,explanation:"手动反转"},{id:"java_str_008",type:"copy",difficulty:3,code:`String s = "Hello World Hello Java";
String[] words = s.split(" ");
Map<String, Integer> count = new HashMap<>();
for (String word : words) {
    count.put(word, count.getOrDefault(word, 0) + 1);
}
System.out.println(count);`,explanation:"单词计数"},{id:"java_str_009",type:"copy",difficulty:2,code:`String s = "Hello123World456";
StringBuilder digits = new StringBuilder();
for (char c : s.toCharArray()) {
    if (Character.isDigit(c)) digits.append(c);
}
System.out.println(digits.toString());`,explanation:"提取数字"},{id:"java_str_010",type:"copy",difficulty:3,code:`String s = "abcba";
boolean isPalindrome = true;
int left = 0, right = s.length() - 1;
while (left < right) {
    if (s.charAt(left) != s.charAt(right)) {
        isPalindrome = false;
        break;
    }
    left++;
    right--;
}
System.out.println(isPalindrome ? "回文" : "非回文");`,explanation:"回文判断"},{id:"java_str_011",type:"copy",difficulty:1,code:`String s = "Hello";
System.out.println(s.charAt(0));
System.out.println(s.charAt(s.length() - 1));`,explanation:"获取字符"},{id:"java_str_012",type:"copy",difficulty:2,code:`String s = "Hello World";
int vowels = 0, consonants = 0;
for (char c : s.toLowerCase().toCharArray()) {
    if (c >= 'a' && c <= 'z') {
        if ("aeiou".indexOf(c) != -1) vowels++;
        else consonants++;
    }
}
System.out.println("元音: " + vowels + ", 辅音: " + consonants);`,explanation:"统计元音辅音"},{id:"java_str_013",type:"copy",difficulty:3,code:`String s = "hello world";
String[] words = s.split(" ");
StringBuilder result = new StringBuilder();
for (String word : words) {
    if (word.length() > 0) {
        result.append(Character.toUpperCase(word.charAt(0)));
        result.append(word.substring(1));
        result.append(" ");
    }
}
System.out.println(result.toString().trim());`,explanation:"首字母大写"},{id:"java_str_014",type:"copy",difficulty:2,code:`String s1 = "Hello";
String s2 = "hello";
System.out.println(s1.equals(s2));
System.out.println(s1.equalsIgnoreCase(s2));
System.out.println(s1.compareTo(s2));`,explanation:"字符串比较"},{id:"java_str_015",type:"copy",difficulty:3,code:`String s = "Hello World";
String[] words = s.split(" ");
for (int i = 0; i < words.length / 2; i++) {
    String temp = words[i];
    words[i] = words[words.length - 1 - i];
    words[words.length - 1 - i] = temp;
}
System.out.println(String.join(" ", words));`,explanation:"单词反转"},{id:"java_str_016",type:"copy",difficulty:1,code:`String name = "Java";
System.out.println("Hello, " + name + "!");
System.out.println(String.format("Hello, %s!", name));`,explanation:"格式化输出"},{id:"java_str_017",type:"copy",difficulty:2,code:`String s = "aabbbcccc";
StringBuilder compressed = new StringBuilder();
int count = 1;
for (int i = 1; i < s.length(); i++) {
    if (s.charAt(i) == s.charAt(i - 1)) {
        count++;
    } else {
        compressed.append(s.charAt(i - 1)).append(count);
        count = 1;
    }
}
compressed.append(s.charAt(s.length() - 1)).append(count);
System.out.println(compressed.toString());`,explanation:"字符串压缩"},{id:"java_str_018",type:"copy",difficulty:3,code:`String s = "abc";
List<String> result = new ArrayList<>();
for (int i = 0; i < s.length(); i++) {
    for (int j = i + 1; j <= s.length(); j++) {
        result.add(s.substring(i, j));
    }
}
System.out.println(result);`,explanation:"所有子串"},{id:"java_str_019",type:"copy",difficulty:2,code:`String email = "user@example.com";
int atIndex = email.indexOf('@');
int dotIndex = email.lastIndexOf('.');
boolean isValid = atIndex > 0 && dotIndex > atIndex;
System.out.println(isValid ? "有效邮箱" : "无效邮箱");`,explanation:"邮箱验证"},{id:"java_str_020",type:"copy",difficulty:3,code:`String s = "abcabcbb";
Map<Character, Integer> map = new HashMap<>();
int maxLen = 0, left = 0;
for (int right = 0; right < s.length(); right++) {
    if (map.containsKey(s.charAt(right))) {
        left = Math.max(left, map.get(s.charAt(right)) + 1);
    }
    map.put(s.charAt(right), right);
    maxLen = Math.max(maxLen, right - left + 1);
}
System.out.println(maxLen);`,explanation:"最长无重复子串"}],J={language:G,module:V,questions:Y},K="Java",Q="function",Z=[{id:"java_func_001",type:"copy",difficulty:1,code:`public static int add(int a, int b) {
    return a + b;
}`,explanation:"基础函数"},{id:"java_func_002",type:"copy",difficulty:2,code:`public static int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,explanation:"递归阶乘"},{id:"java_func_003",type:"copy",difficulty:2,code:`public static int fibonacci(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}`,explanation:"斐波那契数列 - 迭代"},{id:"java_func_004",type:"copy",difficulty:3,code:`public static <T> void quickSort(T[] arr, int low, int high, Comparator<T> comp) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high, comp);
        quickSort(arr, low, pivotIndex - 1, comp);
        quickSort(arr, pivotIndex + 1, high, comp);
    }
}

private static <T> int partition(T[] arr, int low, int high, Comparator<T> comp) {
    T pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (comp.compare(arr[j], pivot) <= 0) {
            i++;
            T temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    T temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`,explanation:"快速排序 - 泛型实现"},{id:"java_func_005",type:"copy",difficulty:2,code:`public static <T> List<T> flatten(List<List<T>> lists) {
    return lists.stream()
        .flatMap(Collection::stream)
        .collect(Collectors.toList());
}`,explanation:"列表扁平化 - Stream API"},{id:"java_func_006",type:"copy",difficulty:3,code:`public static <K, V> Map<K, V> zipToMap(List<K> keys, List<V> values) {
    if (keys.size() != values.size()) {
        throw new IllegalArgumentException("Keys and values must have same size");
    }
    return IntStream.range(0, keys.size())
        .boxed()
        .collect(Collectors.toMap(keys::get, values::get));
}`,explanation:"合并两个列表为Map"},{id:"java_func_007",type:"copy",difficulty:2,code:`public static String formatName(String firstName, String lastName) {
    if (firstName == null && lastName == null) {
        return "";
    }
    if (firstName == null) return lastName.trim();
    if (lastName == null) return firstName.trim();
    return String.format("%s %s", firstName.trim(), lastName.trim());
}`,explanation:"格式化姓名"},{id:"java_func_008",type:"copy",difficulty:3,code:`public static <T> Predicate<T> not(Predicate<T> predicate) {
    return predicate.negate();
}

public static <T> Predicate<T> and(Predicate<T>... predicates) {
    return Arrays.stream(predicates)
        .reduce(Predicate::and)
        .orElse(t -> true);
}`,explanation:"谓词组合器"},{id:"java_func_009",type:"copy",difficulty:2,code:`public static <T> List<List<T>> partition(List<T> list, int size) {
    if (size <= 0) throw new IllegalArgumentException("Size must be positive");
    return IntStream.range(0, (list.size() + size - 1) / size)
        .mapToObj(i -> list.subList(i * size, Math.min((i + 1) * size, list.size())))
        .collect(Collectors.toList());
}`,explanation:"列表分块"},{id:"java_func_010",type:"copy",difficulty:3,code:`public static <T> Optional<T> findFirst(List<T> list, Predicate<T> predicate) {
    for (T item : list) {
        if (predicate.test(item)) {
            return Optional.of(item);
        }
    }
    return Optional.empty();
}`,explanation:"条件查找"},{id:"java_func_011",type:"copy",difficulty:1,explanation:"计算平均值",code:`public static double average(int[] numbers) {
    if (numbers.length == 0) return 0;
    int sum = 0;
    for (int num : numbers) {
        sum += num;
    }
    return (double) sum / numbers.length;
}`},{id:"java_func_012",type:"copy",difficulty:2,code:`public static <T extends Comparable<T>> T findMax(List<T> list) {
    if (list == null || list.isEmpty()) {
        throw new IllegalArgumentException("List cannot be null or empty");
    }
    T max = list.get(0);
    for (T item : list) {
        if (item.compareTo(max) > 0) {
            max = item;
        }
    }
    return max;
}`,explanation:"查找最大值 - 泛型"},{id:"java_func_013",type:"copy",difficulty:3,code:`public static <T> Supplier<T> memoize(Supplier<T> supplier) {
    AtomicReference<T> cached = new AtomicReference<>();
    AtomicBoolean initialized = new AtomicBoolean(false);
    return () -> {
        if (!initialized.getAndSet(true)) {
            cached.set(supplier.get());
        }
        return cached.get();
    };
}`,explanation:"记忆化函数"},{id:"java_func_014",type:"copy",difficulty:2,code:`public static String repeat(String str, int count) {
    if (count < 0) throw new IllegalArgumentException("Count cannot be negative");
    StringBuilder sb = new StringBuilder(str.length() * count);
    for (int i = 0; i < count; i++) {
        sb.append(str);
    }
    return sb.toString();
}`,explanation:"字符串重复"},{id:"java_func_015",type:"copy",difficulty:3,code:`public static <T, R> Function<T, R> compose(Function<T, R>... functions) {
    if (functions.length == 0) {
        throw new IllegalArgumentException("At least one function required");
    }
    return Arrays.stream(functions)
        .reduce(Function::andThen)
        .orElse(Function.identity());
}`,explanation:"函数组合"}],y={language:K,module:Q,questions:Z},X="Python",nn="loop",en=[{id:"py_loop_001",type:"copy",difficulty:1,code:`for i in range(5):
    print(i)`,explanation:"基础for循环"},{id:"py_loop_002",type:"copy",difficulty:1,code:`total = 0
for i in range(1, 101):
    total += i
print(total)`,explanation:"累加求和"},{id:"py_loop_003",type:"copy",difficulty:1,code:`i = 0
while i < 5:
    print(i)
    i += 1`,explanation:"while循环"},{id:"py_loop_004",type:"copy",difficulty:2,code:`def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,explanation:"冒泡排序"},{id:"py_loop_005",type:"copy",difficulty:2,code:`def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True`,explanation:"素数判断"},{id:"py_loop_006",type:"copy",difficulty:2,code:`def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,explanation:"二分查找"},{id:"py_loop_007",type:"copy",difficulty:3,code:`def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`,explanation:"斐波那契数列"},{id:"py_loop_008",type:"copy",difficulty:3,code:`def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,explanation:"两数之和"},{id:"py_loop_009",type:"copy",difficulty:3,code:`def longest_common_prefix(strs):
    if not strs:
        return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix`,explanation:"最长公共前缀"},{id:"py_loop_010",type:"copy",difficulty:2,code:`def max_subarray(nums):
    max_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum`,explanation:"最大子数组和"},{id:"py_loop_011",type:"copy",difficulty:1,code:`squares = [x ** 2 for x in range(10)]
print(squares)`,explanation:"列表推导式"},{id:"py_loop_012",type:"copy",difficulty:2,code:`def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result`,explanation:"递归扁平化列表"},{id:"py_loop_013",type:"copy",difficulty:3,code:`def permutations(lst):
    if len(lst) <= 1:
        return [lst]
    result = []
    for i, item in enumerate(lst):
        rest = lst[:i] + lst[i+1:]
        for p in permutations(rest):
            result.append([item] + p)
    return result`,explanation:"全排列"},{id:"py_loop_014",type:"copy",difficulty:2,code:`def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,explanation:"归并排序"},{id:"py_loop_015",type:"copy",difficulty:3,code:`def length_of_longest_substring(s):
    char_map = {}
    max_len = left = 0
    for right, char in enumerate(s):
        if char in char_map:
            left = max(left, char_map[char] + 1)
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,explanation:"无重复字符最长子串"},{id:"py_loop_016",type:"copy",difficulty:1,code:`for i in range(1, 6):
    for j in range(1, i + 1):
        print(j, end=' ')
    print()`,explanation:"打印三角形"},{id:"py_loop_017",type:"copy",difficulty:2,code:`def climb_stairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,explanation:"爬楼梯"},{id:"py_loop_018",type:"copy",difficulty:3,code:`def generate_parenthesis(n):
    result = []
    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    backtrack('', 0, 0)
    return result`,explanation:"括号生成"},{id:"py_loop_019",type:"copy",difficulty:2,code:`def is_valid(s):
    stack = []
    mapping = {')': '(', ']': '[', '}': '{'}
    for char in s:
        if char in mapping:
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
    return not stack`,explanation:"有效的括号"},{id:"py_loop_020",type:"copy",difficulty:3,code:`def three_sum(nums):
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result`,explanation:"三数之和"}],tn={language:X,module:nn,questions:en},rn="Python",on="condition",an=[{id:"py_cond_001",type:"copy",difficulty:1,code:`x = 10
if x > 0:
    print('正数')`,explanation:"基础if"},{id:"py_cond_002",type:"copy",difficulty:1,code:`score = 85
if score >= 60:
    print('及格')
else:
    print('不及格')`,explanation:"if-else"},{id:"py_cond_003",type:"copy",difficulty:2,code:`score = 85
if score >= 90:
    print('优秀')
elif score >= 80:
    print('良好')
elif score >= 60:
    print('及格')
else:
    print('不及格')`,explanation:"多分支"},{id:"py_cond_004",type:"copy",difficulty:2,code:`year = 2024
is_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
print('闰年' if is_leap else '平年')`,explanation:"闰年判断"},{id:"py_cond_005",type:"copy",difficulty:2,code:`ch = 'A'
if ch.isupper():
    print('大写字母')
elif ch.islower():
    print('小写字母')
elif ch.isdigit():
    print('数字')
else:
    print('其他')`,explanation:"字符类型"},{id:"py_cond_006",type:"copy",difficulty:3,code:`a, b, c = 3, 4, 5
if a + b > c and a + c > b and b + c > a:
    print('可以构成三角形')
    if a == b == c:
        print('等边三角形')
    elif a == b or b == c or a == c:
        print('等腰三角形')
    else:
        print('普通三角形')
else:
    print('不能构成三角形')`,explanation:"三角形判断"},{id:"py_cond_007",type:"copy",difficulty:3,code:`n = 17
is_prime = n > 1
for i in range(2, int(n ** 0.5) + 1):
    if n % i == 0:
        is_prime = False
        break
print('素数' if is_prime else '非素数')`,explanation:"素数判断"},{id:"py_cond_008",type:"copy",difficulty:1,code:`num = 7
print('偶数' if num % 2 == 0 else '奇数')`,explanation:"奇偶判断"},{id:"py_cond_009",type:"copy",difficulty:2,code:`month = 4
if month == 2:
    print('28或29天')
elif month in [4, 6, 9, 11]:
    print('30天')
else:
    print('31天')`,explanation:"月份天数"},{id:"py_cond_010",type:"copy",difficulty:2,code:`x = -5
if x > 0:
    print('正数')
elif x < 0:
    print('负数')
else:
    print('零')`,explanation:"正负零"},{id:"py_cond_011",type:"copy",difficulty:3,code:`score = 75
grade = 'A' if score >= 90 else 'B' if score >= 80 else 'C' if score >= 70 else 'D' if score >= 60 else 'F'
print(grade)`,explanation:"成绩等级"},{id:"py_cond_012",type:"copy",difficulty:2,code:`a, b, c = 10, 20, 30
max_val = max(a, b, c)
print(f'最大值: {max_val}')`,explanation:"三数最大值"},{id:"py_cond_013",type:"copy",difficulty:3,code:`password = 'Abc123'
has_upper = any(c.isupper() for c in password)
has_lower = any(c.islower() for c in password)
has_digit = any(c.isdigit() for c in password)
is_valid = len(password) >= 8 and has_upper and has_lower and has_digit
print('密码有效' if is_valid else '密码无效')`,explanation:"密码验证"},{id:"py_cond_014",type:"copy",difficulty:2,code:`num = 28
divisor_sum = sum(i for i in range(1, num) if num % i == 0)
print('完美数' if divisor_sum == num else '非完美数')`,explanation:"完美数"},{id:"py_cond_015",type:"copy",difficulty:3,code:`n = 12345
reversed_num = 0
original = n
while n > 0:
    reversed_num = reversed_num * 10 + n % 10
    n //= 10
print('回文数' if original == reversed_num else '非回文数')`,explanation:"回文数"},{id:"py_cond_016",type:"copy",difficulty:1,code:`age = 20
print('成年人' if age >= 18 else '未成年人')`,explanation:"年龄判断"},{id:"py_cond_017",type:"copy",difficulty:2,code:`bmi = 22.5
if bmi < 18.5:
    print('偏瘦')
elif bmi < 24:
    print('正常')
elif bmi < 28:
    print('偏胖')
else:
    print('肥胖')`,explanation:"BMI判断"},{id:"py_cond_018",type:"copy",difficulty:3,code:`year, month, day = 2024, 2, 29
is_valid = True
if month < 1 or month > 12:
    is_valid = False
elif day < 1:
    is_valid = False
elif month == 2:
    is_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
    if day > (29 if is_leap else 28):
        is_valid = False
elif month in [4, 6, 9, 11]:
    if day > 30:
        is_valid = False
else:
    if day > 31:
        is_valid = False
print('有效日期' if is_valid else '无效日期')`,explanation:"日期验证"},{id:"py_cond_019",type:"copy",difficulty:2,code:`s = 'abcba'
is_palindrome = s == s[::-1]
print('回文' if is_palindrome else '非回文')`,explanation:"回文判断"},{id:"py_cond_020",type:"copy",difficulty:3,code:`n = 28
def is_perfect(n):
    return sum(i for i in range(1, n) if n % i == 0) == n

result = [x for x in range(1, 1001) if is_perfect(x)]
print(result)`,explanation:"找完美数"}],cn={language:rn,module:on,questions:an},sn="Python",ln="array",pn=[{id:"py_arr_001",type:"copy",difficulty:1,code:`arr = [1, 2, 3, 4, 5]
for item in arr:
    print(item)`,explanation:"遍历列表"},{id:"py_arr_002",type:"copy",difficulty:1,code:`arr = [3, 1, 4, 1, 5, 9]
arr.sort()
print(arr)`,explanation:"列表排序"},{id:"py_arr_003",type:"copy",difficulty:2,code:`def merge_sorted(arr1, arr2):
    result = []
    i = j = 0
    while i < len(arr1) and j < len(arr2):
        if arr1[i] <= arr2[j]:
            result.append(arr1[i])
            i += 1
        else:
            result.append(arr2[j])
            j += 1
    result.extend(arr1[i:])
    result.extend(arr2[j:])
    return result`,explanation:"合并有序数组"},{id:"py_arr_004",type:"copy",difficulty:2,code:`def move_zeroes(nums):
    insert_pos = 0
    for num in nums:
        if num != 0:
            nums[insert_pos] = num
            insert_pos += 1
    for i in range(insert_pos, len(nums)):
        nums[i] = 0`,explanation:"移动零"},{id:"py_arr_005",type:"copy",difficulty:3,code:`def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water`,explanation:"接雨水"},{id:"py_arr_006",type:"copy",difficulty:2,code:`def product_except_self(nums):
    n = len(nums)
    answer = [1] * n
    left = 1
    for i in range(n):
        answer[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= right
        right *= nums[i]
    return answer`,explanation:"除自身以外的乘积"},{id:"py_arr_007",type:"copy",difficulty:3,code:`def max_area(height):
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        water = min(height[left], height[right]) * (right - left)
        max_water = max(max_water, water)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,explanation:"盛最多水的容器"},{id:"py_arr_008",type:"copy",difficulty:2,code:`def contains_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,explanation:"存在重复元素"},{id:"py_arr_009",type:"copy",difficulty:3,code:`def longest_consecutive(nums):
    num_set = set(nums)
    max_streak = 0
    for num in num_set:
        if num - 1 not in num_set:
            current = num
            streak = 1
            while current + 1 in num_set:
                current += 1
                streak += 1
            max_streak = max(max_streak, streak)
    return max_streak`,explanation:"最长连续序列"},{id:"py_arr_010",type:"copy",difficulty:2,code:`def find_min(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    return nums[left]`,explanation:"旋转数组最小值"},{id:"py_arr_011",type:"copy",difficulty:1,code:`arr = [1, 2, 3, 4, 5]
reversed_arr = arr[::-1]
print(reversed_arr)`,explanation:"列表反转"},{id:"py_arr_012",type:"copy",difficulty:2,code:`def subsets(nums):
    result = [[]]
    for num in nums:
        new_subsets = [subset + [num] for subset in result]
        result.extend(new_subsets)
    return result`,explanation:"子集"},{id:"py_arr_013",type:"copy",difficulty:3,code:`def max_sliding_window(nums, k):
    from collections import deque
    dq = deque()
    result = []
    for i, num in enumerate(nums):
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        while dq and nums[dq[-1]] < num:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`,explanation:"滑动窗口最大值"},{id:"py_arr_014",type:"copy",difficulty:2,code:`def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,explanation:"颜色分类"},{id:"py_arr_015",type:"copy",difficulty:3,code:`def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,explanation:"搜索旋转数组"},{id:"py_arr_016",type:"copy",difficulty:1,code:`arr = [1, 2, 3, 4, 5]
print(max(arr))
print(min(arr))
print(sum(arr))`,explanation:"内置函数"},{id:"py_arr_017",type:"copy",difficulty:2,code:`def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,explanation:"两数之和"},{id:"py_arr_018",type:"copy",difficulty:3,code:`def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,explanation:"快速排序"},{id:"py_arr_019",type:"copy",difficulty:2,code:`def rotate(nums, k):
    k = k % len(nums)
    nums.reverse()
    nums[:k] = reversed(nums[:k])
    nums[k:] = reversed(nums[k:])`,explanation:"轮转数组"},{id:"py_arr_020",type:"copy",difficulty:3,code:`def find_duplicate(nums):
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow`,explanation:"找重复数"}],m={language:sn,module:ln,questions:pn},un="Python",dn="string",fn=[{id:"py_str_001",type:"copy",difficulty:1,code:`s = 'Hello World'
print(len(s))
print(s.upper())
print(s.lower())`,explanation:"基础操作"},{id:"py_str_002",type:"copy",difficulty:1,code:`s1 = 'Hello'
s2 = 'World'
s3 = f'{s1} {s2}'
print(s3)`,explanation:"f-string格式化"},{id:"py_str_003",type:"copy",difficulty:2,code:`s = 'Hello World'
print(s.find('World'))
print('World' in s)
print(s.startswith('Hello'))
print(s.endswith('World'))`,explanation:"查找操作"},{id:"py_str_004",type:"copy",difficulty:2,code:`s = 'Hello World'
print(s[6:])
print(s[:5])
print(s[2:7])`,explanation:"切片操作"},{id:"py_str_005",type:"copy",difficulty:2,code:`s = 'Hello World'
print(s.replace('World', 'Python'))
print(s.split(' '))
print('-'.join(['a', 'b', 'c']))`,explanation:"替换分割"},{id:"py_str_006",type:"copy",difficulty:2,code:`s = '  Hello World  '
print(s.strip())
print(s.lstrip())
print(s.rstrip())`,explanation:"去除空格"},{id:"py_str_007",type:"copy",difficulty:3,code:`s = 'Hello World'
reversed_s = s[::-1]
print(reversed_s)`,explanation:"字符串反转"},{id:"py_str_008",type:"copy",difficulty:3,code:`s = 'Hello World Hello Python'
words = s.split()
word_count = {}
for word in words:
    word_count[word] = word_count.get(word, 0) + 1
print(word_count)`,explanation:"单词计数"},{id:"py_str_009",type:"copy",difficulty:2,code:`s = 'Hello123World456'
digits = ''.join(c for c in s if c.isdigit())
print(digits)`,explanation:"提取数字"},{id:"py_str_010",type:"copy",difficulty:3,code:`s = 'abcba'
is_palindrome = s == s[::-1]
print('回文' if is_palindrome else '非回文')`,explanation:"回文判断"},{id:"py_str_011",type:"copy",difficulty:1,code:`s = 'Hello'
print(s[0])
print(s[-1])
print(s[1:4])`,explanation:"字符访问"},{id:"py_str_012",type:"copy",difficulty:2,code:`s = 'Hello World'
vowels = sum(1 for c in s.lower() if c in 'aeiou')
consonants = sum(1 for c in s.lower() if c.isalpha() and c not in 'aeiou')
print(f'元音: {vowels}, 辅音: {consonants}')`,explanation:"统计元音辅音"},{id:"py_str_013",type:"copy",difficulty:3,code:`s = 'hello world'
result = ' '.join(word.capitalize() for word in s.split())
print(result)`,explanation:"首字母大写"},{id:"py_str_014",type:"copy",difficulty:2,code:`s1 = 'Hello'
s2 = 'hello'
print(s1 == s2)
print(s1.lower() == s2.lower())
print(s1 < s2)`,explanation:"字符串比较"},{id:"py_str_015",type:"copy",difficulty:3,code:`s = 'Hello World'
words = s.split()
reversed_words = ' '.join(reversed(words))
print(reversed_words)`,explanation:"单词反转"},{id:"py_str_016",type:"copy",difficulty:1,code:`name = 'Python'
print(f'Hello, {name}!')
print('Hello, {}!'.format(name))`,explanation:"格式化"},{id:"py_str_017",type:"copy",difficulty:2,code:`s = 'aabbbcccc'
compressed = []
count = 1
for i in range(1, len(s)):
    if s[i] == s[i-1]:
        count += 1
    else:
        compressed.append(f'{s[i-1]}{count}')
        count = 1
compressed.append(f'{s[-1]}{count}')
print(''.join(compressed))`,explanation:"字符串压缩"},{id:"py_str_018",type:"copy",difficulty:3,code:`s = 'abc'
result = [s[i:j] for i in range(len(s)) for j in range(i+1, len(s)+1)]
print(result)`,explanation:"所有子串"},{id:"py_str_019",type:"copy",difficulty:2,code:`email = 'user@example.com'
is_valid = '@' in email and '.' in email.split('@')[1]
print('有效邮箱' if is_valid else '无效邮箱')`,explanation:"邮箱验证"},{id:"py_str_020",type:"copy",difficulty:3,code:`s = 'abcabcbb'
char_map = {}
max_len = left = 0
for right, char in enumerate(s):
    if char in char_map:
        left = max(left, char_map[char] + 1)
    char_map[char] = right
    max_len = max(max_len, right - left + 1)
print(max_len)`,explanation:"最长无重复子串"}],yn={language:un,module:dn,questions:fn},mn="Python",_n="function",gn=[{id:"py_func_001",type:"copy",difficulty:1,code:`def add(a, b):
    return a + b

print(add(3, 5))`,explanation:"基础函数"},{id:"py_func_002",type:"copy",difficulty:1,code:`def greet(name):
    return f'Hello, {name}!'

print(greet('World'))`,explanation:"字符串格式化"},{id:"py_func_003",type:"copy",difficulty:2,code:`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,explanation:"递归阶乘"},{id:"py_func_004",type:"copy",difficulty:2,code:`def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`,explanation:"斐波那契"},{id:"py_func_005",type:"copy",difficulty:3,code:`def memoize(func):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@memoize
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`,explanation:"装饰器记忆化"},{id:"py_func_006",type:"copy",difficulty:2,code:`def compose(*functions):
    def composed(x):
        for f in reversed(functions):
            x = f(x)
        return x
    return composed

double = lambda x: x * 2
increment = lambda x: x + 1
result = compose(double, increment)(5)
print(result)`,explanation:"函数组合"},{id:"py_func_007",type:"copy",difficulty:3,code:`def curry(func):
    def curried(*args):
        if len(args) >= func.__code__.co_argcount:
            return func(*args)
        return lambda *more_args: curried(*args, *more_args)
    return curried

@curry
def add_three(a, b, c):
    return a + b + c

print(add_three(1)(2)(3))`,explanation:"柯里化"},{id:"py_func_008",type:"copy",difficulty:2,code:`def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result`,explanation:"递归扁平化"},{id:"py_func_009",type:"copy",difficulty:3,code:`def pipe(*functions):
    def piped(x):
        result = x
        for f in functions:
            result = f(result)
        return result
    return piped

add_one = lambda x: x + 1
double = lambda x: x * 2
square = lambda x: x ** 2

result = pipe(add_one, double, square)(3)
print(result)`,explanation:"管道函数"},{id:"py_func_010",type:"copy",difficulty:2,code:`def retry(max_attempts):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
        return wrapper
    return decorator`,explanation:"重试装饰器"},{id:"py_func_011",type:"copy",difficulty:1,code:`def is_even(n):
    return n % 2 == 0

numbers = [1, 2, 3, 4, 5, 6]
even_numbers = list(filter(is_even, numbers))
print(even_numbers)`,explanation:"filter函数"},{id:"py_func_012",type:"copy",difficulty:2,code:`def map_func(func, lst):
    return [func(item) for item in lst]

result = map_func(lambda x: x ** 2, [1, 2, 3, 4])
print(result)`,explanation:"map实现"},{id:"py_func_013",type:"copy",difficulty:3,code:`def reduce(func, lst, initial=None):
    if initial is None:
        result = lst[0]
        lst = lst[1:]
    else:
        result = initial
    for item in lst:
        result = func(result, item)
    return result

result = reduce(lambda a, b: a + b, [1, 2, 3, 4], 0)
print(result)`,explanation:"reduce实现"},{id:"py_func_014",type:"copy",difficulty:2,code:`def partial(func, *args, **kwargs):
    def wrapper(*more_args, **more_kwargs):
        return func(*args, *more_args, **kwargs, **more_kwargs)
    return wrapper

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)
print(square(5))
print(cube(3))`,explanation:"偏函数"},{id:"py_func_015",type:"copy",difficulty:3,code:`class LazyProperty:
    def __init__(self, func):
        self.func = func
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        value = self.func(obj)
        setattr(obj, self.func.__name__, value)
        return value

class Circle:
    def __init__(self, radius):
        self.radius = radius
    
    @LazyProperty
    def area(self):
        print('Computing area...')
        return 3.14159 * self.radius ** 2`,explanation:"惰性属性"},{id:"py_func_016",type:"copy",difficulty:1,code:`def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4, 5))`,explanation:"可变参数"},{id:"py_func_017",type:"copy",difficulty:2,code:`def validate(schema):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for i, (arg, (name, expected_type)) in enumerate(zip(args, schema.items())):
                if not isinstance(arg, expected_type):
                    raise TypeError(f'{name} must be {expected_type.__name__}')
            return func(*args, **kwargs)
        return wrapper
    return decorator`,explanation:"参数验证装饰器"},{id:"py_func_018",type:"copy",difficulty:3,code:`def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Database:
    def __init__(self):
        print('Connecting...')`,explanation:"单例模式"},{id:"py_func_019",type:"copy",difficulty:2,code:`def cached_property(func):
    @property
    def wrapper(self):
        attr_name = f'_{func.__name__}'
        if not hasattr(self, attr_name):
            setattr(self, attr_name, func(self))
        return getattr(self, attr_name)
    return wrapper`,explanation:"缓存属性"},{id:"py_func_020",type:"copy",difficulty:3,code:`def context_manager(func):
    class ContextManager:
        def __init__(self, *args, **kwargs):
            self.gen = func(*args, **kwargs)
        
        def __enter__(self):
            return next(self.gen)
        
        def __exit__(self, exc_type, exc_val, exc_tb):
            try:
                next(self.gen)
            except StopIteration:
                pass
    return ContextManager

@context_manager
def timer():
    import time
    start = time.time()
    yield start
    print(f'Elapsed: {time.time() - start:.2f}s')`,explanation:"上下文管理器"}],_={language:mn,module:_n,questions:gn},hn="C++",xn="loop",bn=[{id:"cpp_loop_001",type:"copy",difficulty:1,code:`for (int i = 0; i < 5; i++) {
    cout << i << endl;
}`,explanation:"基础for循环"},{id:"cpp_loop_002",type:"copy",difficulty:1,code:`int sum = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
}
cout << sum << endl;`,explanation:"累加求和"},{id:"cpp_loop_003",type:"copy",difficulty:2,code:`void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,explanation:"冒泡排序"},{id:"cpp_loop_004",type:"copy",difficulty:2,code:`bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}`,explanation:"素数判断"},{id:"cpp_loop_005",type:"copy",difficulty:2,code:`int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,explanation:"二分查找"},{id:"cpp_loop_006",type:"copy",difficulty:3,code:`vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,explanation:"两数之和"},{id:"cpp_loop_007",type:"copy",difficulty:3,code:`int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}`,explanation:"最大子数组和"},{id:"cpp_loop_008",type:"copy",difficulty:2,code:`void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
    }
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    for (k = 0; k < temp.size(); k++) {
        arr[left + k] = temp[k];
    }
}`,explanation:"归并"},{id:"cpp_loop_009",type:"copy",difficulty:3,code:`int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> charMap;
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        if (charMap.count(s[right])) {
            left = max(left, charMap[s[right]] + 1);
        }
        charMap[s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,explanation:"无重复最长子串"},{id:"cpp_loop_010",type:"copy",difficulty:2,code:`int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}`,explanation:"爬楼梯"},{id:"cpp_loop_011",type:"copy",difficulty:1,code:`vector<int> arr = {1, 2, 3, 4, 5};
for (int x : arr) {
    cout << x << " ";
}`,explanation:"范围for循环"},{id:"cpp_loop_012",type:"copy",difficulty:3,code:`bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> mapping = {{')', '('}, {']', '['}, {'}', '{'}};
    for (char c : s) {
        if (mapping.count(c)) {
            if (st.empty() || st.top() != mapping[c]) return false;
            st.pop();
        } else {
            st.push(c);
        }
    }
    return st.empty();
}`,explanation:"有效的括号"},{id:"cpp_loop_013",type:"copy",difficulty:2,code:`void reverse(vector<int>& arr) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        swap(arr[left], arr[right]);
        left++;
        right--;
    }
}`,explanation:"数组反转"},{id:"cpp_loop_014",type:"copy",difficulty:3,code:`vector<vector<int>> threeSum(vector<int>& nums) {
    vector<vector<int>> result;
    sort(nums.begin(), nums.end());
    for (int i = 0; i < nums.size() - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = nums.size() - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.push_back({nums[i], nums[left], nums[right]});
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++; right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return result;
}`,explanation:"三数之和"},{id:"cpp_loop_015",type:"copy",difficulty:2,code:`int findMin(vector<int>& nums) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > nums[right]) left = mid + 1;
        else right = mid;
    }
    return nums[left];
}`,explanation:"旋转数组最小值"},{id:"cpp_loop_016",type:"copy",difficulty:1,code:`int i = 0;
while (i < 5) {
    cout << i << endl;
    i++;
}`,explanation:"while循环"},{id:"cpp_loop_017",type:"copy",difficulty:3,code:`vector<string> generateParenthesis(int n) {
    vector<string> result;
    function<void(string, int, int)> backtrack = [&](string current, int open, int close) {
        if (current.size() == 2 * n) {
            result.push_back(current);
            return;
        }
        if (open < n) backtrack(current + "(", open + 1, close);
        if (close < open) backtrack(current + ")", open, close + 1);
    };
    backtrack("", 0, 0);
    return result;
}`,explanation:"括号生成"},{id:"cpp_loop_018",type:"copy",difficulty:2,code:`void rotate(vector<int>& nums, int k) {
    k = k % nums.size();
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
}`,explanation:"轮转数组"},{id:"cpp_loop_019",type:"copy",difficulty:3,code:`int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else water += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else water += rightMax - height[right];
            right--;
        }
    }
    return water;
}`,explanation:"接雨水"},{id:"cpp_loop_020",type:"copy",difficulty:2,code:`int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxWater = 0;
    while (left < right) {
        int water = min(height[left], height[right]) * (right - left);
        maxWater = max(maxWater, water);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}`,explanation:"盛最多水的容器"}],En={language:hn,module:xn,questions:bn},Sn="C++",Tn="condition",$n=[{id:"cpp_cond_001",type:"copy",difficulty:1,code:`int x = 10;
if (x > 0) {
    cout << "正数" << endl;
}`,explanation:"基础if"},{id:"cpp_cond_002",type:"copy",difficulty:1,code:`int score = 85;
if (score >= 60) {
    cout << "及格" << endl;
} else {
    cout << "不及格" << endl;
}`,explanation:"if-else"},{id:"cpp_cond_003",type:"copy",difficulty:2,code:`int score = 85;
if (score >= 90) cout << "优秀";
else if (score >= 80) cout << "良好";
else if (score >= 60) cout << "及格";
else cout << "不及格";`,explanation:"多分支"},{id:"cpp_cond_004",type:"copy",difficulty:2,code:`int year = 2024;
bool isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
cout << (isLeap ? "闰年" : "平年") << endl;`,explanation:"闰年判断"},{id:"cpp_cond_005",type:"copy",difficulty:2,code:`char ch = 'A';
if (ch >= 'A' && ch <= 'Z') cout << "大写字母";
else if (ch >= 'a' && ch <= 'z') cout << "小写字母";
else if (ch >= '0' && ch <= '9') cout << "数字";
else cout << "其他";`,explanation:"字符类型"},{id:"cpp_cond_006",type:"copy",difficulty:2,code:`int day = 3;
switch (day) {
    case 1: cout << "周一"; break;
    case 2: cout << "周二"; break;
    case 3: cout << "周三"; break;
    case 4: cout << "周四"; break;
    case 5: cout << "周五"; break;
    default: cout << "周末";
}`,explanation:"switch-case"},{id:"cpp_cond_007",type:"copy",difficulty:3,code:`int a = 3, b = 4, c = 5;
if (a + b > c && a + c > b && b + c > a) {
    cout << "可以构成三角形" << endl;
    if (a == b && b == c) cout << "等边三角形";
    else if (a == b || b == c || a == c) cout << "等腰三角形";
    else cout << "普通三角形";
}`,explanation:"三角形判断"},{id:"cpp_cond_008",type:"copy",difficulty:3,code:`int n = 17;
bool isPrime = n > 1;
for (int i = 2; i * i <= n; i++) {
    if (n % i == 0) {
        isPrime = false;
        break;
    }
}
cout << (isPrime ? "素数" : "非素数") << endl;`,explanation:"素数判断"},{id:"cpp_cond_009",type:"copy",difficulty:1,code:`int num = 7;
cout << (num % 2 == 0 ? "偶数" : "奇数") << endl;`,explanation:"奇偶判断"},{id:"cpp_cond_010",type:"copy",difficulty:2,code:`int month = 4;
if (month == 2) cout << "28或29天";
else if (month == 4 || month == 6 || month == 9 || month == 11) cout << "30天";
else cout << "31天";`,explanation:"月份天数"},{id:"cpp_cond_011",type:"copy",difficulty:3,code:`int x = 5;
string result = (x % 2 == 0) ? "偶数" : "奇数";
cout << result << endl;`,explanation:"三元运算符"},{id:"cpp_cond_012",type:"copy",difficulty:2,code:`int x = -5;
if (x > 0) cout << "正数";
else if (x < 0) cout << "负数";
else cout << "零";`,explanation:"正负零"},{id:"cpp_cond_013",type:"copy",difficulty:3,code:`int score = 75;
char grade;
if (score >= 90) grade = 'A';
else if (score >= 80) grade = 'B';
else if (score >= 70) grade = 'C';
else if (score >= 60) grade = 'D';
else grade = 'F';
cout << grade << endl;`,explanation:"成绩等级"},{id:"cpp_cond_014",type:"copy",difficulty:2,code:`int a = 10, b = 20, c = 30;
int max = a;
if (b > max) max = b;
if (c > max) max = c;
cout << "最大值: " << max << endl;`,explanation:"三数最大值"},{id:"cpp_cond_015",type:"copy",difficulty:3,code:`string password = "Abc123";
bool hasUpper = false, hasLower = false, hasDigit = false;
for (char c : password) {
    if (isupper(c)) hasUpper = true;
    if (islower(c)) hasLower = true;
    if (isdigit(c)) hasDigit = true;
}
bool isValid = password.length() >= 8 && hasUpper && hasLower && hasDigit;
cout << (isValid ? "密码有效" : "密码无效") << endl;`,explanation:"密码验证"},{id:"cpp_cond_016",type:"copy",difficulty:1,code:`int age = 20;
cout << (age >= 18 ? "成年人" : "未成年人") << endl;`,explanation:"年龄判断"},{id:"cpp_cond_017",type:"copy",difficulty:2,code:`int num = 28;
int sum = 0;
for (int i = 1; i < num; i++) {
    if (num % i == 0) sum += i;
}
cout << (sum == num ? "完美数" : "非完美数") << endl;`,explanation:"完美数"},{id:"cpp_cond_018",type:"copy",difficulty:3,code:`int n = 12345;
int reversed = 0, original = n;
while (n > 0) {
    reversed = reversed * 10 + n % 10;
    n /= 10;
}
cout << (original == reversed ? "回文数" : "非回文数") << endl;`,explanation:"回文数"},{id:"cpp_cond_019",type:"copy",difficulty:2,code:`double bmi = 22.5;
if (bmi < 18.5) cout << "偏瘦";
else if (bmi < 24) cout << "正常";
else if (bmi < 28) cout << "偏胖";
else cout << "肥胖";`,explanation:"BMI判断"},{id:"cpp_cond_020",type:"copy",difficulty:3,code:`int year = 2024, month = 2, day = 29;
bool isValid = true;
if (month < 1 || month > 12) isValid = false;
else if (day < 1) isValid = false;
else if (month == 2) {
    bool isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    if (day > (isLeap ? 29 : 28)) isValid = false;
} else if (month == 4 || month == 6 || month == 9 || month == 11) {
    if (day > 30) isValid = false;
} else {
    if (day > 31) isValid = false;
}
cout << (isValid ? "有效日期" : "无效日期") << endl;`,explanation:"日期验证"}],vn={language:Sn,module:Tn,questions:$n},wn="C++",Nn="array",jn=[{id:"cpp_arr_001",type:"copy",difficulty:1,code:`vector<int> arr = {1, 2, 3, 4, 5};
for (int x : arr) {
    cout << x << endl;
}`,explanation:"遍历数组"},{id:"cpp_arr_002",type:"copy",difficulty:1,code:`vector<int> arr = {3, 1, 4, 1, 5, 9};
sort(arr.begin(), arr.end());
for (int x : arr) cout << x << " ";`,explanation:"排序"},{id:"cpp_arr_003",type:"copy",difficulty:2,code:`vector<int> mergeSorted(vector<int>& a, vector<int>& b) {
    vector<int> result;
    int i = 0, j = 0;
    while (i < a.size() && j < b.size()) {
        if (a[i] <= b[j]) result.push_back(a[i++]);
        else result.push_back(b[j++]);
    }
    while (i < a.size()) result.push_back(a[i++]);
    while (j < b.size()) result.push_back(b[j++]);
    return result;
}`,explanation:"合并有序数组"},{id:"cpp_arr_004",type:"copy",difficulty:2,code:`void moveZeroes(vector<int>& nums) {
    int insertPos = 0;
    for (int num : nums) {
        if (num != 0) nums[insertPos++] = num;
    }
    while (insertPos < nums.size()) nums[insertPos++] = 0;
}`,explanation:"移动零"},{id:"cpp_arr_005",type:"copy",difficulty:3,code:`vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> answer(n, 1);
    int left = 1;
    for (int i = 0; i < n; i++) {
        answer[i] = left;
        left *= nums[i];
    }
    int right = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] *= right;
        right *= nums[i];
    }
    return answer;
}`,explanation:"除自身以外的乘积"},{id:"cpp_arr_006",type:"copy",difficulty:2,code:`bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int num : nums) {
        if (seen.count(num)) return true;
        seen.insert(num);
    }
    return false;
}`,explanation:"存在重复元素"},{id:"cpp_arr_007",type:"copy",difficulty:3,code:`int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int maxStreak = 0;
    for (int num : numSet) {
        if (!numSet.count(num - 1)) {
            int current = num, streak = 1;
            while (numSet.count(current + 1)) {
                current++;
                streak++;
            }
            maxStreak = max(maxStreak, streak);
        }
    }
    return maxStreak;
}`,explanation:"最长连续序列"},{id:"cpp_arr_008",type:"copy",difficulty:2,code:`vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result = {{}};
    for (int num : nums) {
        int size = result.size();
        for (int i = 0; i < size; i++) {
            vector<int> subset = result[i];
            subset.push_back(num);
            result.push_back(subset);
        }
    }
    return result;
}`,explanation:"子集"},{id:"cpp_arr_009",type:"copy",difficulty:3,code:`vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> result;
    for (int i = 0; i < nums.size(); i++) {
        while (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) result.push_back(nums[dq.front()]);
    }
    return result;
}`,explanation:"滑动窗口最大值"},{id:"cpp_arr_010",type:"copy",difficulty:2,code:`void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) swap(nums[low++], nums[mid++]);
        else if (nums[mid] == 1) mid++;
        else swap(nums[mid], nums[high--]);
    }
}`,explanation:"颜色分类"},{id:"cpp_arr_011",type:"copy",difficulty:1,code:`vector<int> arr = {1, 2, 3, 4, 5};
reverse(arr.begin(), arr.end());
for (int x : arr) cout << x << " ";`,explanation:"数组反转"},{id:"cpp_arr_012",type:"copy",difficulty:3,code:`int search(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) right = mid - 1;
            else left = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[right]) left = mid + 1;
            else right = mid - 1;
        }
    }
    return -1;
}`,explanation:"搜索旋转数组"},{id:"cpp_arr_013",type:"copy",difficulty:2,code:`void rotate(vector<int>& nums, int k) {
    k = k % nums.size();
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
}`,explanation:"轮转数组"},{id:"cpp_arr_014",type:"copy",difficulty:3,code:`int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,explanation:"快速排序"},{id:"cpp_arr_015",type:"copy",difficulty:2,code:`vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}`,explanation:"两数之和"},{id:"cpp_arr_016",type:"copy",difficulty:1,code:`vector<int> arr(5);
for (int i = 0; i < 5; i++) {
    arr[i] = i * 2;
}
for (int x : arr) cout << x << " ";`,explanation:"数组填充"},{id:"cpp_arr_017",type:"copy",difficulty:3,code:`int findDuplicate(vector<int>& nums) {
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    slow = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}`,explanation:"找重复数"},{id:"cpp_arr_018",type:"copy",difficulty:2,code:`void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}`,explanation:"归并排序"},{id:"cpp_arr_019",type:"copy",difficulty:2,code:`int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX, maxProfit = 0;
    for (int price : prices) {
        minPrice = min(minPrice, price);
        maxProfit = max(maxProfit, price - minPrice);
    }
    return maxProfit;
}`,explanation:"买卖股票"},{id:"cpp_arr_020",type:"copy",difficulty:3,code:`int LIS(vector<int>& nums) {
    vector<int> dp(nums.size(), 1);
    int maxLen = 1;
    for (int i = 1; i < nums.size(); i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
        maxLen = max(maxLen, dp[i]);
    }
    return maxLen;
}`,explanation:"最长递增子序列"}],g={language:wn,module:Nn,questions:jn},Rn="C++",An="string",Cn=[{id:"cpp_str_001",type:"copy",difficulty:1,code:`string s = "Hello World";
cout << s.length() << endl;
cout << s.size() << endl;`,explanation:"字符串长度"},{id:"cpp_str_002",type:"copy",difficulty:1,code:`string s1 = "Hello";
string s2 = "World";
string s3 = s1 + " " + s2;
cout << s3 << endl;`,explanation:"字符串拼接"},{id:"cpp_str_003",type:"copy",difficulty:2,code:`string s = "Hello World";
cout << s.find("World") << endl;
cout << (s.find("World") != string::npos) << endl;
cout << (s.substr(0, 5) == "Hello") << endl;`,explanation:"查找操作"},{id:"cpp_str_004",type:"copy",difficulty:2,code:`string s = "Hello World";
cout << s.substr(6) << endl;
cout << s.substr(0, 5) << endl;
cout << s.substr(2, 5) << endl;`,explanation:"截取子串"},{id:"cpp_str_005",type:"copy",difficulty:2,code:`string s = "Hello World";
s.replace(6, 5, "C++");
cout << s << endl;`,explanation:"字符串替换"},{id:"cpp_str_006",type:"copy",difficulty:3,code:`string s = "Hello World";
string reversed(s.rbegin(), s.rend());
cout << reversed << endl;`,explanation:"字符串反转"},{id:"cpp_str_007",type:"copy",difficulty:3,code:`string s = "Hello World Hello C++";
map<string, int> wordCount;
stringstream ss(s);
string word;
while (ss >> word) {
    wordCount[word]++;
}
for (const auto& p : wordCount) {
    cout << p.first << ": " << p.second << endl;
}`,explanation:"单词计数"},{id:"cpp_str_008",type:"copy",difficulty:2,code:`string s = "Hello123World456";
string digits;
for (char c : s) {
    if (isdigit(c)) digits += c;
}
cout << digits << endl;`,explanation:"提取数字"},{id:"cpp_str_009",type:"copy",difficulty:3,code:`string s = "abcba";
bool isPalindrome = true;
int left = 0, right = s.length() - 1;
while (left < right) {
    if (s[left] != s[right]) {
        isPalindrome = false;
        break;
    }
    left++; right--;
}
cout << (isPalindrome ? "回文" : "非回文") << endl;`,explanation:"回文判断"},{id:"cpp_str_010",type:"copy",difficulty:2,code:`string s = "Hello World";
int vowels = 0, consonants = 0;
for (char c : s) {
    if (isalpha(c)) {
        c = tolower(c);
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') vowels++;
        else consonants++;
    }
}
cout << "元音: " << vowels << ", 辅音: " << consonants << endl;`,explanation:"统计元音辅音"},{id:"cpp_str_011",type:"copy",difficulty:1,code:`string s = "Hello";
cout << s[0] << endl;
cout << s[s.length() - 1] << endl;`,explanation:"字符访问"},{id:"cpp_str_012",type:"copy",difficulty:3,code:`string s = "hello world";
stringstream ss(s);
string word, result;
while (ss >> word) {
    word[0] = toupper(word[0]);
    result += word + " ";
}
cout << result << endl;`,explanation:"首字母大写"},{id:"cpp_str_013",type:"copy",difficulty:2,code:`string s1 = "Hello";
string s2 = "hello";
cout << (s1 == s2) << endl;
transform(s1.begin(), s1.end(), s1.begin(), ::tolower);
transform(s2.begin(), s2.end(), s2.begin(), ::tolower);
cout << (s1 == s2) << endl;`,explanation:"字符串比较"},{id:"cpp_str_014",type:"copy",difficulty:3,code:`string s = "Hello World";
vector<string> words;
stringstream ss(s);
string word;
while (ss >> word) words.push_back(word);
reverse(words.begin(), words.end());
for (const auto& w : words) cout << w << " ";`,explanation:"单词反转"},{id:"cpp_str_015",type:"copy",difficulty:1,code:`string name = "C++";
cout << "Hello, " << name << "!" << endl;`,explanation:"格式化输出"},{id:"cpp_str_016",type:"copy",difficulty:2,code:`string s = "aabbbcccc";
string compressed;
int count = 1;
for (int i = 1; i < s.length(); i++) {
    if (s[i] == s[i-1]) count++;
    else {
        compressed += s[i-1] + to_string(count);
        count = 1;
    }
}
compressed += s.back() + to_string(count);
cout << compressed << endl;`,explanation:"字符串压缩"},{id:"cpp_str_017",type:"copy",difficulty:3,code:`string s = "abc";
vector<string> result;
for (int i = 0; i < s.length(); i++) {
    for (int j = i + 1; j <= s.length(); j++) {
        result.push_back(s.substr(i, j - i));
    }
}
for (const auto& sub : result) cout << sub << " ";`,explanation:"所有子串"},{id:"cpp_str_018",type:"copy",difficulty:2,code:`string email = "user@example.com";
size_t atPos = email.find('@');
size_t dotPos = email.rfind('.');
bool isValid = atPos != string::npos && dotPos > atPos;
cout << (isValid ? "有效邮箱" : "无效邮箱") << endl;`,explanation:"邮箱验证"},{id:"cpp_str_019",type:"copy",difficulty:3,code:`string s = "abcabcbb";
unordered_map<char, int> charMap;
int maxLen = 0, left = 0;
for (int right = 0; right < s.length(); right++) {
    if (charMap.count(s[right])) {
        left = max(left, charMap[s[right]] + 1);
    }
    charMap[s[right]] = right;
    maxLen = max(maxLen, right - left + 1);
}
cout << maxLen << endl;`,explanation:"最长无重复子串"},{id:"cpp_str_020",type:"copy",difficulty:2,code:`string s = "Hello World";
replace(s.begin(), s.end(), ' ', '_');
cout << s << endl;`,explanation:"字符替换"}],Ln={language:Rn,module:An,questions:Cn},kn="C++",On="function",Hn=[{id:"cpp_func_001",type:"copy",difficulty:1,code:`int add(int a, int b) {
    return a + b;
}

cout << add(3, 5) << endl;`,explanation:"基础函数"},{id:"cpp_func_002",type:"copy",difficulty:1,code:`string greet(string name) {
    return "Hello, " + name + "!";
}

cout << greet("World") << endl;`,explanation:"字符串拼接"},{id:"cpp_func_003",type:"copy",difficulty:2,code:`int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,explanation:"递归阶乘"},{id:"cpp_func_004",type:"copy",difficulty:2,code:`int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}`,explanation:"斐波那契"},{id:"cpp_func_005",type:"copy",difficulty:3,code:`template<typename T>
T findMax(vector<T>& arr) {
    T maxVal = arr[0];
    for (const auto& item : arr) {
        if (item > maxVal) maxVal = item;
    }
    return maxVal;
}`,explanation:"泛型查找最大值"},{id:"cpp_func_006",type:"copy",difficulty:2,code:`function<int(int)> compose(function<int(int)> f, function<int(int)> g) {
    return [f, g](int x) { return f(g(x)); };
}

auto double_it = [](int x) { return x * 2; };
auto increment = [](int x) { return x + 1; };
auto result = compose(double_it, increment)(5);
cout << result << endl;`,explanation:"函数组合"},{id:"cpp_func_007",type:"copy",difficulty:3,code:`function<int(int, int, int)> curry(function<int(int, int, int)> f) {
    return [f](int a) {
        return [f, a](int b) {
            return [f, a, b](int c) {
                return f(a, b, c);
            };
        };
    };
}

auto add3 = [](int a, int b, int c) { return a + b + c; };
auto curried = curry(add3);
cout << curried(1)(2)(3) << endl;`,explanation:"柯里化"},{id:"cpp_func_008",type:"copy",difficulty:2,code:`vector<int> flatten(const vector<vector<int>>& lists) {
    vector<int> result;
    for (const auto& list : lists) {
        result.insert(result.end(), list.begin(), list.end());
    }
    return result;
}`,explanation:"列表扁平化"},{id:"cpp_func_009",type:"copy",difficulty:3,code:`template<typename T>
vector<T> filter(function<bool(T)> pred, const vector<T>& vec) {
    vector<T> result;
    for (const auto& item : vec) {
        if (pred(item)) result.push_back(item);
    }
    return result;
}

auto isEven = [](int x) { return x % 2 == 0; };
auto evens = filter(isEven, vector<int>{1, 2, 3, 4, 5, 6});`,explanation:"filter实现"},{id:"cpp_func_010",type:"copy",difficulty:2,code:`template<typename T, typename R>
vector<R> mapFunction(function<R(T)> func, const vector<T>& vec) {
    vector<R> result;
    for (const auto& item : vec) {
        result.push_back(func(item));
    }
    return result;
}

auto squared = mapFunction<int, int>([](int x) { return x * x; }, {1, 2, 3, 4});`,explanation:"map实现"},{id:"cpp_func_011",type:"copy",difficulty:1,code:`bool isEven(int n) {
    return n % 2 == 0;
}

for (int i = 1; i <= 10; i++) {
    if (isEven(i)) cout << i << " ";
}`,explanation:"判断偶数"},{id:"cpp_func_012",type:"copy",difficulty:3,code:`template<typename T>
T reduce(function<T(T, T)> func, T init, const vector<T>& vec) {
    T result = init;
    for (const auto& item : vec) {
        result = func(result, item);
    }
    return result;
}

auto sum = reduce<int>([](int a, int b) { return a + b; }, 0, {1, 2, 3, 4});`,explanation:"reduce实现"},{id:"cpp_func_013",type:"copy",difficulty:2,code:`bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    return true;
}`,explanation:"回文判断"},{id:"cpp_func_014",type:"copy",difficulty:3,code:`class Memoize {
    unordered_map<int, int> cache;
    function<int(int)> func;
public:
    Memoize(function<int(int)> f) : func(f) {}
    int operator()(int n) {
        if (cache.find(n) == cache.end()) {
            cache[n] = func(n);
        }
        return cache[n];
    }
};`,explanation:"记忆化类"},{id:"cpp_func_015",type:"copy",difficulty:2,code:`string repeat(string s, int n) {
    string result;
    for (int i = 0; i < n; i++) {
        result += s;
    }
    return result;
}

cout << repeat("Ha", 3) << endl;`,explanation:"字符串重复"},{id:"cpp_func_016",type:"copy",difficulty:1,code:`int maxVal(int a, int b) {
    return a > b ? a : b;
}

cout << maxVal(10, 20) << endl;`,explanation:"返回较大值"},{id:"cpp_func_017",type:"copy",difficulty:3,code:`function<int(int)> partial(function<int(int, int)> f, int a) {
    return [f, a](int b) { return f(a, b); };
}

auto add = [](int a, int b) { return a + b; };
auto add5 = partial(add, 5);
cout << add5(3) << endl;`,explanation:"偏函数"},{id:"cpp_func_018",type:"copy",difficulty:2,code:`int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int lcm(int a, int b) {
    return a * b / gcd(a, b);
}`,explanation:"最大公约数/最小公倍数"},{id:"cpp_func_019",type:"copy",difficulty:3,code:`class Singleton {
    static Singleton* instance;
    Singleton() {}
public:
    static Singleton* getInstance() {
        if (!instance) {
            instance = new Singleton();
        }
        return instance;
    }
};

Singleton* Singleton::instance = nullptr;`,explanation:"单例模式"},{id:"cpp_func_020",type:"copy",difficulty:2,code:`template<typename T>
void printVector(const vector<T>& vec) {
    for (const auto& item : vec) {
        cout << item << " ";
    }
    cout << endl;
}

printVector(vector<int>{1, 2, 3, 4, 5});
printVector(vector<string>{"a", "b", "c"});`,explanation:"泛型打印"}],h={language:kn,module:On,questions:Hn},In="JavaScript",qn="loop",Mn=[{id:"js_loop_001",type:"copy",difficulty:1,code:`for (let i = 0; i < 5; i++) {
    console.log(i);
}`,explanation:"基础for循环"},{id:"js_loop_002",type:"copy",difficulty:1,code:`let sum = 0;
for (let i = 1; i <= 100; i++) {
    sum += i;
}
console.log('Sum:', sum);`,explanation:"累加求和"},{id:"js_loop_003",type:"copy",difficulty:2,code:`const arr = [64, 34, 25, 12, 22, 11, 90];
for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
    }
}`,explanation:"冒泡排序（解构交换）"},{id:"js_loop_004",type:"copy",difficulty:2,code:`function isPrime(n) {
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}`,explanation:"素数判断"},{id:"js_loop_005",type:"copy",difficulty:1,code:`let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}`,explanation:"while循环"},{id:"js_loop_006",type:"copy",difficulty:2,code:`function fibonacci(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}`,explanation:"斐波那契数列"},{id:"js_loop_007",type:"copy",difficulty:1,code:`const colors = ['red', 'green', 'blue'];
for (const color of colors) {
    console.log(color);
}`,explanation:"for...of遍历"},{id:"js_loop_008",type:"copy",difficulty:2,code:`const obj = { a: 1, b: 2, c: 3 };
for (const key in obj) {
    console.log(key, obj[key]);
}`,explanation:"for...in遍历对象"},{id:"js_loop_009",type:"copy",difficulty:2,code:`function factorial(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}`,explanation:"阶乘计算"},{id:"js_loop_010",type:"copy",difficulty:2,code:`const arr = [1, 2, 3, 4, 5];
let max = arr[0];
for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
}`,explanation:"查找最大值"},{id:"js_loop_011",type:"copy",difficulty:1,code:`let i = 10;
do {
    console.log(i);
    i--;
} while (i > 0);`,explanation:"do...while循环"},{id:"js_loop_012",type:"copy",difficulty:3,code:`function matrixMultiply(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}`,explanation:"矩阵乘法"},{id:"js_loop_013",type:"copy",difficulty:2,code:`const arr = [1, 2, 3, 4, 5];
const reversed = [];
for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
}`,explanation:"数组反转"},{id:"js_loop_014",type:"copy",difficulty:1,code:"for (let i = 1; i <= 9; i++) {\n    for (let j = 1; j <= i; j++) {\n        process.stdout.write(`${j}*${i}=${i*j}\\t`);\n    }\n    console.log();\n}",explanation:"九九乘法表"},{id:"js_loop_015",type:"copy",difficulty:2,code:`function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,explanation:"二分查找"},{id:"js_loop_016",type:"copy",difficulty:2,code:`const arr = [2, 1, 5, 3, 4];
for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
    }
    arr[j + 1] = key;
}`,explanation:"插入排序"},{id:"js_loop_017",type:"copy",difficulty:3,code:`function generatePermutations(str) {
    const results = [];
    function permute(current, remaining) {
        if (remaining.length === 0) {
            results.push(current);
            return;
        }
        for (let i = 0; i < remaining.length; i++) {
            permute(
                current + remaining[i],
                remaining.slice(0, i) + remaining.slice(i + 1)
            );
        }
    }
    permute('', str);
    return results;
}`,explanation:"字符串全排列"},{id:"js_loop_018",type:"copy",difficulty:1,code:`let count = 0;
for (let i = 1; i <= 100; i++) {
    if (i % 3 === 0) count++;
}
console.log('3的倍数个数:', count);`,explanation:"计数3的倍数"},{id:"js_loop_019",type:"copy",difficulty:2,code:`function flatten(arr) {
    const result = [];
    for (const item of arr) {
        if (Array.isArray(item)) {
            result.push(...flatten(item));
        } else {
            result.push(item);
        }
    }
    return result;
}`,explanation:"递归扁平化数组"},{id:"js_loop_020",type:"copy",difficulty:2,code:`const map = new Map();
const arr = [1, 2, 2, 3, 3, 3];
for (const num of arr) {
    map.set(num, (map.get(num) || 0) + 1);
}`,explanation:"Map统计频率"}],Dn={language:In,module:qn,questions:Mn},Fn="JavaScript",Wn="condition",Un=[{id:"js_cond_001",type:"copy",difficulty:1,code:`const x = 10;
if (x > 0) {
    console.log('正数');
} else if (x < 0) {
    console.log('负数');
} else {
    console.log('零');
}`,explanation:"多分支判断"},{id:"js_cond_002",type:"copy",difficulty:1,code:`const age = 20;
const status = age >= 18 ? '成年' : '未成年';`,explanation:"三元运算符"},{id:"js_cond_003",type:"copy",difficulty:2,code:`function getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}`,explanation:"成绩等级判断"},{id:"js_cond_004",type:"copy",difficulty:1,code:`const day = 3;
switch (day) {
    case 1: console.log('周一'); break;
    case 2: console.log('周二'); break;
    case 3: console.log('周三'); break;
    default: console.log('其他');
}`,explanation:"switch语句"},{id:"js_cond_005",type:"copy",difficulty:2,code:`function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}`,explanation:"闰年判断"},{id:"js_cond_006",type:"copy",difficulty:2,code:`function maxOfThree(a, b, c) {
    if (a >= b && a >= c) return a;
    if (b >= a && b >= c) return b;
    return c;
}`,explanation:"三数最大值"},{id:"js_cond_007",type:"copy",difficulty:2,code:`function classifyTriangle(a, b, c) {
    if (a + b <= c || a + c <= b || b + c <= a) {
        return '非三角形';
    }
    if (a === b && b === c) return '等边';
    if (a === b || b === c || a === c) return '等腰';
    return '普通';
}`,explanation:"三角形分类"},{id:"js_cond_008",type:"copy",difficulty:1,code:`const num = 7;
if (num % 2 === 0) {
    console.log('偶数');
} else {
    console.log('奇数');
}`,explanation:"奇偶判断"},{id:"js_cond_009",type:"copy",difficulty:2,code:`function isValidEmail(email) {
    return email.includes('@') && email.includes('.') &&
           email.indexOf('@') < email.lastIndexOf('.');
}`,explanation:"简单邮箱验证"},{id:"js_cond_010",type:"copy",difficulty:2,code:`const score = 85;
let level;
if (score >= 90) {
    level = '优秀';
} else if (score >= 80) {
    level = '良好';
} else if (score >= 70) {
    level = '中等';
} else if (score >= 60) {
    level = '及格';
} else {
    level = '不及格';
}`,explanation:"成绩等级（变量赋值）"},{id:"js_cond_011",type:"copy",difficulty:2,code:`function getSeason(month) {
    if (month >= 3 && month <= 5) return '春天';
    if (month >= 6 && month <= 8) return '夏天';
    if (month >= 9 && month <= 11) return '秋天';
    return '冬天';
}`,explanation:"季节判断"},{id:"js_cond_012",type:"copy",difficulty:3,code:`function calculateBMI(weight, height) {
    const bmi = weight / (height * height);
    if (bmi < 18.5) return { bmi, category: '偏瘦' };
    if (bmi < 24) return { bmi, category: '正常' };
    if (bmi < 28) return { bmi, category: '偏胖' };
    return { bmi, category: '肥胖' };
}`,explanation:"BMI计算与分类"},{id:"js_cond_013",type:"copy",difficulty:1,code:`const a = true;
const b = false;
console.log('AND:', a && b);
console.log('OR:', a || b);
console.log('NOT:', !a);`,explanation:"逻辑运算符"},{id:"js_cond_014",type:"copy",difficulty:2,code:`function isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}`,explanation:"回文判断"},{id:"js_cond_015",type:"copy",difficulty:2,code:`function getDaysInMonth(month, year) {
    switch (month) {
        case 2: return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
        case 4: case 6: case 9: case 11: return 30;
        default: return 31;
    }
}`,explanation:"月份天数"},{id:"js_cond_016",type:"copy",difficulty:2,code:`function canVote(age, isCitizen) {
    if (typeof age !== 'number' || age < 0) return false;
    return age >= 18 && isCitizen;
}`,explanation:"投票资格判断"},{id:"js_cond_017",type:"copy",difficulty:2,code:`function shippingCost(weight) {
    if (weight <= 0) return 0;
    if (weight <= 1) return 10;
    if (weight <= 5) return 20;
    return 30;
}`,explanation:"运费计算"},{id:"js_cond_018",type:"copy",difficulty:3,code:`function solveQuadratic(a, b, c) {
    const discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return { roots: 2, x1, x2 };
    } else if (discriminant === 0) {
        return { roots: 1, x1: -b / (2 * a) };
    }
    return { roots: 0 };
}`,explanation:"一元二次方程求解"},{id:"js_cond_019",type:"copy",difficulty:1,code:`const value = null;
const result = value ?? '默认值';
console.log(result);`,explanation:"空值合并运算符"},{id:"js_cond_020",type:"copy",difficulty:2,code:`function checkAccess(role, permission) {
    const permissions = {
        admin: ['read', 'write', 'delete'],
        editor: ['read', 'write'],
        viewer: ['read']
    };
    return permissions[role]?.includes(permission) ?? false;
}`,explanation:"权限检查（可选链）"}],Pn={language:Fn,module:Wn,questions:Un},Bn="JavaScript",zn="array",Gn=[{id:"js_arr_001",type:"copy",difficulty:1,code:`const arr = [1, 2, 3, 4, 5];
arr.push(6);
arr.pop();
arr.shift();
arr.unshift(0);`,explanation:"数组增删操作"},{id:"js_arr_002",type:"copy",difficulty:1,code:`const arr = [1, 2, 3, 4, 5];
const doubled = arr.map(x => x * 2);
const evens = arr.filter(x => x % 2 === 0);
const sum = arr.reduce((acc, x) => acc + x, 0);`,explanation:"map/filter/reduce"},{id:"js_arr_003",type:"copy",difficulty:2,code:`function mergeSorted(arr1, arr2) {
    const result = [];
    let i = 0, j = 0;
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            result.push(arr1[i++]);
        } else {
            result.push(arr2[j++]);
        }
    }
    return result.concat(arr1.slice(i)).concat(arr2.slice(j));
}`,explanation:"合并有序数组"},{id:"js_arr_004",type:"copy",difficulty:2,code:`function removeDuplicates(arr) {
    return [...new Set(arr)];
}`,explanation:"Set去重"},{id:"js_arr_005",type:"copy",difficulty:1,code:`const arr = [3, 1, 4, 1, 5, 9];
arr.sort((a, b) => a - b);
console.log(arr);`,explanation:"数字排序"},{id:"js_arr_006",type:"copy",difficulty:2,code:`function chunk(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}`,explanation:"数组分块"},{id:"js_arr_007",type:"copy",difficulty:2,code:`const matrix = [[1, 2], [3, 4], [5, 6]];
const flat = matrix.reduce((acc, row) => acc.concat(row), []);`,explanation:"二维数组扁平化"},{id:"js_arr_008",type:"copy",difficulty:2,code:`function intersection(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(x => set2.has(x));
}`,explanation:"数组交集"},{id:"js_arr_009",type:"copy",difficulty:2,code:`function difference(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(x => !set2.has(x));
}`,explanation:"数组差集"},{id:"js_arr_010",type:"copy",difficulty:1,code:`const arr = [1, 2, 3, 4, 5];
const [first, second, ...rest] = arr;
console.log(first, second, rest);`,explanation:"解构赋值"},{id:"js_arr_011",type:"copy",difficulty:2,code:`function zip(arr1, arr2) {
    const length = Math.min(arr1.length, arr2.length);
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push([arr1[i], arr2[i]]);
    }
    return result;
}`,explanation:"数组配对"},{id:"js_arr_012",type:"copy",difficulty:3,code:`function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[0];
    const left = arr.slice(1).filter(x => x <= pivot);
    const right = arr.slice(1).filter(x => x > pivot);
    return [...quickSort(left), pivot, ...quickSort(right)];
}`,explanation:"快速排序"},{id:"js_arr_013",type:"copy",difficulty:2,code:`function groupBy(arr, keyFn) {
    return arr.reduce((groups, item) => {
        const key = keyFn(item);
        (groups[key] = groups[key] || []).push(item);
        return groups;
    }, {});
}`,explanation:"数组分组"},{id:"js_arr_014",type:"copy",difficulty:1,code:`const arr = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr, ...arr2];
console.log(combined);`,explanation:"展开运算符合并"},{id:"js_arr_015",type:"copy",difficulty:2,code:`function rotate(arr, k) {
    const n = arr.length;
    k = k % n;
    return [...arr.slice(-k), ...arr.slice(0, n - k)];
}`,explanation:"数组旋转"},{id:"js_arr_016",type:"copy",difficulty:2,code:`const arr = [1, 2, 3, 4, 5];
const hasThree = arr.includes(3);
const index = arr.indexOf(3);
const found = arr.find(x => x > 3);
const foundIndex = arr.findIndex(x => x > 3);`,explanation:"查找方法"},{id:"js_arr_017",type:"copy",difficulty:3,code:`function permutations(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        for (const perm of permutations(rest)) {
            result.push([arr[i], ...perm]);
        }
    }
    return result;
}`,explanation:"数组全排列"},{id:"js_arr_018",type:"copy",difficulty:2,code:`function compact(arr) {
    return arr.filter(Boolean);
}`,explanation:"过滤假值"},{id:"js_arr_019",type:"copy",difficulty:2,code:`const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce((acc, val) => acc + val, 0);
const avg = sum / arr.length;
const max = Math.max(...arr);
const min = Math.min(...arr);`,explanation:"统计计算"},{id:"js_arr_020",type:"copy",difficulty:2,code:`function flattenDeep(arr) {
    return arr.reduce((acc, val) =>
        Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    []);
}`,explanation:"深度扁平化"}],x={language:Bn,module:zn,questions:Gn},Vn="JavaScript",Yn="string",Jn=[{id:"js_str_001",type:"copy",difficulty:1,code:`const str = 'Hello, World!';
console.log(str.length);
console.log(str.toUpperCase());
console.log(str.toLowerCase());`,explanation:"基本字符串方法"},{id:"js_str_002",type:"copy",difficulty:1,code:`const str = 'Hello, World!';
console.log(str.slice(0, 5));
console.log(str.substring(7, 12));
console.log(str.indexOf('World'));`,explanation:"截取与查找"},{id:"js_str_003",type:"copy",difficulty:2,code:`function reverseString(str) {
    return str.split('').reverse().join('');
}`,explanation:"字符串反转"},{id:"js_str_004",type:"copy",difficulty:2,code:`function countChar(str, char) {
    return str.split('').filter(c => c === char).length;
}`,explanation:"字符计数"},{id:"js_str_005",type:"copy",difficulty:1,code:"const name = 'Alice';\nconst greeting = `Hello, ${name}!`;\nconsole.log(greeting);",explanation:"模板字符串"},{id:"js_str_006",type:"copy",difficulty:2,code:`function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}`,explanation:"首字母大写"},{id:"js_str_007",type:"copy",difficulty:2,code:`function camelize(str) {
    return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}`,explanation:"连字符转驼峰"},{id:"js_str_008",type:"copy",difficulty:2,code:`function truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
}`,explanation:"字符串截断"},{id:"js_str_009",type:"copy",difficulty:2,code:`function isAnagram(str1, str2) {
    const sort = s => s.toLowerCase().split('').sort().join('');
    return sort(str1) === sort(str2);
}`,explanation:"变位词判断"},{id:"js_str_010",type:"copy",difficulty:1,code:`const csv = 'apple,banana,cherry';
const fruits = csv.split(',');
const joined = fruits.join(' | ');`,explanation:"split和join"},{id:"js_str_011",type:"copy",difficulty:2,code:`function repeat(str, n) {
    return str.repeat(n);
}`,explanation:"字符串重复"},{id:"js_str_012",type:"copy",difficulty:2,code:`function padLeft(str, length, char = ' ') {
    return str.padStart(length, char);
}`,explanation:"左侧填充"},{id:"js_str_013",type:"copy",difficulty:2,code:`function replaceAll(str, search, replacement) {
    return str.split(search).join(replacement);
}`,explanation:"全部替换"},{id:"js_str_014",type:"copy",difficulty:3,code:`function longestCommonPrefix(strs) {
    if (strs.length === 0) return '';
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.slice(0, -1);
        }
    }
    return prefix;
}`,explanation:"最长公共前缀"},{id:"js_str_015",type:"copy",difficulty:2,code:`function countWords(str) {
    return str.trim().split(/\\s+/).length;
}`,explanation:"单词计数"},{id:"js_str_016",type:"copy",difficulty:2,code:`function escapeHtml(str) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, c => map[c]);
}`,explanation:"HTML转义"},{id:"js_str_017",type:"copy",difficulty:2,code:`function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\\s_]+/g, '-')
        .toLowerCase();
}`,explanation:"转连字符命名"},{id:"js_str_018",type:"copy",difficulty:2,code:`function substringBetween(str, start, end) {
    const s = str.indexOf(start);
    const e = str.indexOf(end, s + start.length);
    if (s === -1 || e === -1) return '';
    return str.substring(s + start.length, e);
}`,explanation:"提取子串"},{id:"js_str_019",type:"copy",difficulty:3,code:`function isMatch(str, pattern) {
    const dp = Array(str.length + 1).fill(null)
        .map(() => Array(pattern.length + 1).fill(false));
    dp[0][0] = true;
    for (let j = 1; j <= pattern.length; j++) {
        if (pattern[j - 1] === '*') dp[0][j] = dp[0][j - 2];
    }
    for (let i = 1; i <= str.length; i++) {
        for (let j = 1; j <= pattern.length; j++) {
            if (pattern[j - 1] === '*') {
                dp[i][j] = dp[i][j - 2] ||
                    (str[i-1] === pattern[j-2] || pattern[j-2] === '.') && dp[i-1][j];
            } else {
                dp[i][j] = dp[i-1][j-1] &&
                    (pattern[j-1] === '.' || str[i-1] === pattern[j-1]);
            }
        }
    }
    return dp[str.length][pattern.length];
}`,explanation:"正则匹配（动态规划）"},{id:"js_str_020",type:"copy",difficulty:2,code:`function parseQueryString(qs) {
    return qs.slice(1).split('&').reduce((params, pair) => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        return params;
    }, {});
}`,explanation:"解析查询字符串"}],Kn={language:Vn,module:Yn,questions:Jn},Qn="JavaScript",Zn="function",Xn=[{id:"js_func_001",type:"copy",difficulty:1,code:`function add(a, b) {
    return a + b;
}
console.log(add(3, 5));`,explanation:"基础函数定义"},{id:"js_func_002",type:"copy",difficulty:1,code:`const multiply = (a, b) => a * b;
console.log(multiply(4, 5));`,explanation:"箭头函数"},{id:"js_func_003",type:"copy",difficulty:2,code:`function sum(...nums) {
    return nums.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3, 4));`,explanation:"rest参数"},{id:"js_func_004",type:"copy",difficulty:2,code:`function greet(name = 'World') {
    return \`Hello, \${name}!\`;
}
console.log(greet());
console.log(greet('Alice'));`,explanation:"默认参数"},{id:"js_func_005",type:"copy",difficulty:2,code:`function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}`,explanation:"防抖函数"},{id:"js_func_006",type:"copy",difficulty:2,code:`function throttle(fn, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}`,explanation:"节流函数"},{id:"js_func_007",type:"copy",difficulty:2,code:`function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return (...moreArgs) => curried(...args, ...moreArgs);
    };
}
const add3 = curry((a, b, c) => a + b + c);
console.log(add3(1)(2)(3));`,explanation:"函数柯里化"},{id:"js_func_008",type:"copy",difficulty:3,code:`function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}`,explanation:"记忆化函数"},{id:"js_func_009",type:"copy",difficulty:2,code:`function compose(...fns) {
    return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}
const add1 = x => x + 1;
const double = x => x * 2;
const add1ThenDouble = compose(double, add1);
console.log(add1ThenDouble(3));`,explanation:"函数组合"},{id:"js_func_010",type:"copy",difficulty:2,code:`function pipe(...fns) {
    return (x) => fns.reduce((acc, fn) => fn(acc), x);
}
const add1 = x => x + 1;
const double = x => x * 2;
const doubleThenAdd1 = pipe(double, add1);
console.log(doubleThenAdd1(3));`,explanation:"管道函数"},{id:"js_func_011",type:"copy",difficulty:1,code:`const obj = {
    name: 'Alice',
    greet() {
        return \`Hi, I'm \${this.name}\`;
    }
};
console.log(obj.greet());`,explanation:"对象方法"},{id:"js_func_012",type:"copy",difficulty:2,code:`function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
console.log(factorial(5));`,explanation:"递归阶乘"},{id:"js_func_013",type:"copy",difficulty:2,code:`function fibonacci(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
    return memo[n];
}`,explanation:"记忆化斐波那契"},{id:"js_func_014",type:"copy",difficulty:2,code:`function once(fn) {
    let called = false;
    let result;
    return function(...args) {
        if (!called) {
            result = fn(...args);
            called = true;
        }
        return result;
    };
}`,explanation:"一次性函数"},{id:"js_func_015",type:"copy",difficulty:2,code:`function retry(fn, maxAttempts = 3) {
    return async function(...args) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                return await fn(...args);
            } catch (err) {
                if (i === maxAttempts - 1) throw err;
            }
        }
    };
}`,explanation:"重试函数"},{id:"js_func_016",type:"copy",difficulty:2,code:`function partial(fn, ...presetArgs) {
    return function(...laterArgs) {
        return fn(...presetArgs, ...laterArgs);
    };
}
const add = (a, b, c) => a + b + c;
const add5 = partial(add, 5);
console.log(add5(3, 2));`,explanation:"偏函数"},{id:"js_func_017",type:"copy",difficulty:3,code:`class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, listener) {
        (this.events[event] = this.events[event] || []).push(listener);
        return this;
    }
    emit(event, ...args) {
        (this.events[event] || []).forEach(fn => fn(...args));
    }
    off(event, listener) {
        this.events[event] = (this.events[event] || []).filter(fn => fn !== listener);
    }
}`,explanation:"事件发射器"},{id:"js_func_018",type:"copy",difficulty:2,code:`function range(start, end, step = 1) {
    const result = [];
    for (let i = start; step > 0 ? i < end : i > end; i += step) {
        result.push(i);
    }
    return result;
}
console.log(range(1, 10, 2));`,explanation:"生成范围数组"},{id:"js_func_019",type:"copy",difficulty:2,code:`function pick(obj, keys) {
    return keys.reduce((result, key) => {
        if (key in obj) result[key] = obj[key];
        return result;
    }, {});
}
const obj = { a: 1, b: 2, c: 3 };
console.log(pick(obj, ['a', 'c']));`,explanation:"对象属性选取"},{id:"js_func_020",type:"copy",difficulty:2,code:`function omit(obj, keys) {
    return Object.keys(obj)
        .filter(key => !keys.includes(key))
        .reduce((result, key) => {
            result[key] = obj[key];
            return result;
        }, {});
}`,explanation:"对象属性排除"}],b={language:Qn,module:Zn,questions:Xn},ne="TypeScript",ee="loop",te=[{id:"ts_loop_001",type:"copy",difficulty:1,code:`for (let i: number = 0; i < 5; i++) {
    console.log(i);
}`,explanation:"基础for循环（类型注解）"},{id:"ts_loop_002",type:"copy",difficulty:1,code:`let sum: number = 0;
for (let i: number = 1; i <= 100; i++) {
    sum += i;
}
console.log('Sum:', sum);`,explanation:"累加求和"},{id:"ts_loop_003",type:"copy",difficulty:2,code:`const arr: number[] = [64, 34, 25, 12, 22, 11, 90];
for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
    }
}`,explanation:"冒泡排序"},{id:"ts_loop_004",type:"copy",difficulty:2,code:`function isPrime(n: number): boolean {
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}`,explanation:"素数判断"},{id:"ts_loop_005",type:"copy",difficulty:1,code:`let i: number = 0;
while (i < 5) {
    console.log(i);
    i++;
}`,explanation:"while循环"},{id:"ts_loop_006",type:"copy",difficulty:2,code:`function fibonacci(n: number): number {
    if (n <= 1) return n;
    let a: number = 0, b: number = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}`,explanation:"斐波那契数列"},{id:"ts_loop_007",type:"copy",difficulty:1,code:`const colors: string[] = ['red', 'green', 'blue'];
for (const color of colors) {
    console.log(color);
}`,explanation:"for...of遍历"},{id:"ts_loop_008",type:"copy",difficulty:2,code:`const obj: Record<string, number> = { a: 1, b: 2, c: 3 };
for (const key in obj) {
    console.log(key, obj[key]);
}`,explanation:"for...in遍历对象"},{id:"ts_loop_009",type:"copy",difficulty:2,code:`function factorial(n: number): number {
    let result: number = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}`,explanation:"阶乘计算"},{id:"ts_loop_010",type:"copy",difficulty:2,code:`const arr: number[] = [1, 2, 3, 4, 5];
let max: number = arr[0];
for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
}`,explanation:"查找最大值"},{id:"ts_loop_011",type:"copy",difficulty:1,code:`let i: number = 10;
do {
    console.log(i);
    i--;
} while (i > 0);`,explanation:"do...while循环"},{id:"ts_loop_012",type:"copy",difficulty:3,code:`function matrixMultiply(a: number[][], b: number[][]): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum: number = 0;
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}`,explanation:"矩阵乘法"},{id:"ts_loop_013",type:"copy",difficulty:2,code:`const arr: number[] = [1, 2, 3, 4, 5];
const reversed: number[] = [];
for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
}`,explanation:"数组反转"},{id:"ts_loop_014",type:"copy",difficulty:1,code:"for (let i: number = 1; i <= 9; i++) {\n    for (let j: number = 1; j <= i; j++) {\n        process.stdout.write(`${j}*${i}=${i*j}\\t`);\n    }\n    console.log();\n}",explanation:"九九乘法表"},{id:"ts_loop_015",type:"copy",difficulty:2,code:`function binarySearch(arr: number[], target: number): number {
    let left: number = 0, right: number = arr.length - 1;
    while (left <= right) {
        const mid: number = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,explanation:"二分查找"},{id:"ts_loop_016",type:"copy",difficulty:2,code:`const arr: number[] = [2, 1, 5, 3, 4];
for (let i = 1; i < arr.length; i++) {
    const key: number = arr[i];
    let j: number = i - 1;
    while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
    }
    arr[j + 1] = key;
}`,explanation:"插入排序"},{id:"ts_loop_017",type:"copy",difficulty:3,code:`function generatePermutations(str: string): string[] {
    const results: string[] = [];
    function permute(current: string, remaining: string): void {
        if (remaining.length === 0) {
            results.push(current);
            return;
        }
        for (let i = 0; i < remaining.length; i++) {
            permute(
                current + remaining[i],
                remaining.slice(0, i) + remaining.slice(i + 1)
            );
        }
    }
    permute('', str);
    return results;
}`,explanation:"字符串全排列"},{id:"ts_loop_018",type:"copy",difficulty:1,code:`let count: number = 0;
for (let i: number = 1; i <= 100; i++) {
    if (i % 3 === 0) count++;
}
console.log('3的倍数个数:', count);`,explanation:"计数3的倍数"},{id:"ts_loop_019",type:"copy",difficulty:2,code:`function flatten(arr: any[]): any[] {
    const result: any[] = [];
    for (const item of arr) {
        if (Array.isArray(item)) {
            result.push(...flatten(item));
        } else {
            result.push(item);
        }
    }
    return result;
}`,explanation:"递归扁平化数组"},{id:"ts_loop_020",type:"copy",difficulty:2,code:`const map = new Map<number, number>();
const arr: number[] = [1, 2, 2, 3, 3, 3];
for (const num of arr) {
    map.set(num, (map.get(num) || 0) + 1);
}`,explanation:"Map统计频率"}],ie={language:ne,module:ee,questions:te},re="TypeScript",oe="condition",ae=[{id:"ts_cond_001",type:"copy",difficulty:1,code:`const x: number = 10;
if (x > 0) {
    console.log('正数');
} else if (x < 0) {
    console.log('负数');
} else {
    console.log('零');
}`,explanation:"多分支判断"},{id:"ts_cond_002",type:"copy",difficulty:1,code:`const age: number = 20;
const status: string = age >= 18 ? '成年' : '未成年';`,explanation:"三元运算符"},{id:"ts_cond_003",type:"copy",difficulty:2,code:`function getGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}`,explanation:"成绩等级判断"},{id:"ts_cond_004",type:"copy",difficulty:1,code:`const day: number = 3;
switch (day) {
    case 1: console.log('周一'); break;
    case 2: console.log('周二'); break;
    case 3: console.log('周三'); break;
    default: console.log('其他');
}`,explanation:"switch语句"},{id:"ts_cond_005",type:"copy",difficulty:2,code:`function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}`,explanation:"闰年判断"},{id:"ts_cond_006",type:"copy",difficulty:2,code:`function maxOfThree(a: number, b: number, c: number): number {
    if (a >= b && a >= c) return a;
    if (b >= a && b >= c) return b;
    return c;
}`,explanation:"三数最大值"},{id:"ts_cond_007",type:"copy",difficulty:2,code:`function classifyTriangle(a: number, b: number, c: number): string {
    if (a + b <= c || a + c <= b || b + c <= a) {
        return '非三角形';
    }
    if (a === b && b === c) return '等边';
    if (a === b || b === c || a === c) return '等腰';
    return '普通';
}`,explanation:"三角形分类"},{id:"ts_cond_008",type:"copy",difficulty:1,code:`const num: number = 7;
if (num % 2 === 0) {
    console.log('偶数');
} else {
    console.log('奇数');
}`,explanation:"奇偶判断"},{id:"ts_cond_009",type:"copy",difficulty:2,code:`function isValidEmail(email: string): boolean {
    return email.includes('@') && email.includes('.') &&
           email.indexOf('@') < email.lastIndexOf('.');
}`,explanation:"简单邮箱验证"},{id:"ts_cond_010",type:"copy",difficulty:2,code:`const score: number = 85;
let level: string;
if (score >= 90) {
    level = '优秀';
} else if (score >= 80) {
    level = '良好';
} else if (score >= 70) {
    level = '中等';
} else if (score >= 60) {
    level = '及格';
} else {
    level = '不及格';
}`,explanation:"成绩等级（变量赋值）"},{id:"ts_cond_011",type:"copy",difficulty:2,code:`function getSeason(month: number): string {
    if (month >= 3 && month <= 5) return '春天';
    if (month >= 6 && month <= 8) return '夏天';
    if (month >= 9 && month <= 11) return '秋天';
    return '冬天';
}`,explanation:"季节判断"},{id:"ts_cond_012",type:"copy",difficulty:3,code:`interface BmiResult {
    bmi: number;
    category: string;
}

function calculateBMI(weight: number, height: number): BmiResult {
    const bmi: number = weight / (height * height);
    if (bmi < 18.5) return { bmi, category: '偏瘦' };
    if (bmi < 24) return { bmi, category: '正常' };
    if (bmi < 28) return { bmi, category: '偏胖' };
    return { bmi, category: '肥胖' };
}`,explanation:"BMI计算（接口类型）"},{id:"ts_cond_013",type:"copy",difficulty:1,code:`const a: boolean = true;
const b: boolean = false;
console.log('AND:', a && b);
console.log('OR:', a || b);
console.log('NOT:', !a);`,explanation:"逻辑运算符"},{id:"ts_cond_014",type:"copy",difficulty:2,code:`function isPalindrome(str: string): boolean {
    const cleaned: string = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}`,explanation:"回文判断"},{id:"ts_cond_015",type:"copy",difficulty:2,code:`function getDaysInMonth(month: number, year: number): number {
    switch (month) {
        case 2: return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
        case 4: case 6: case 9: case 11: return 30;
        default: return 31;
    }
}`,explanation:"月份天数"},{id:"ts_cond_016",type:"copy",difficulty:2,code:`function canVote(age: number, isCitizen: boolean): boolean {
    if (typeof age !== 'number' || age < 0) return false;
    return age >= 18 && isCitizen;
}`,explanation:"投票资格判断"},{id:"ts_cond_017",type:"copy",difficulty:2,code:`function shippingCost(weight: number): number {
    if (weight <= 0) return 0;
    if (weight <= 1) return 10;
    if (weight <= 5) return 20;
    return 30;
}`,explanation:"运费计算"},{id:"ts_cond_018",type:"copy",difficulty:3,code:`interface QuadraticResult {
    roots: number;
    x1?: number;
    x2?: number;
}

function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
    const discriminant: number = b * b - 4 * a * c;
    if (discriminant > 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return { roots: 2, x1, x2 };
    } else if (discriminant === 0) {
        return { roots: 1, x1: -b / (2 * a) };
    }
    return { roots: 0 };
}`,explanation:"一元二次方程（接口）"},{id:"ts_cond_019",type:"copy",difficulty:1,code:`const value: string | null = null;
const result: string = value ?? '默认值';
console.log(result);`,explanation:"空值合并运算符"},{id:"ts_cond_020",type:"copy",difficulty:2,code:`type Role = 'admin' | 'editor' | 'viewer';
type Permission = 'read' | 'write' | 'delete';

function checkAccess(role: Role, permission: Permission): boolean {
    const permissions: Record<Role, Permission[]> = {
        admin: ['read', 'write', 'delete'],
        editor: ['read', 'write'],
        viewer: ['read']
    };
    return permissions[role]?.includes(permission) ?? false;
}`,explanation:"类型别名与权限检查"}],ce={language:re,module:oe,questions:ae},se="TypeScript",le="array",pe=[{id:"ts_arr_001",type:"copy",difficulty:1,code:`const arr: number[] = [1, 2, 3, 4, 5];
arr.push(6);
arr.pop();
arr.shift();
arr.unshift(0);`,explanation:"数组增删操作"},{id:"ts_arr_002",type:"copy",difficulty:1,code:`const arr: number[] = [1, 2, 3, 4, 5];
const doubled: number[] = arr.map(x => x * 2);
const evens: number[] = arr.filter(x => x % 2 === 0);
const sum: number = arr.reduce((acc, x) => acc + x, 0);`,explanation:"map/filter/reduce"},{id:"ts_arr_003",type:"copy",difficulty:2,code:`function mergeSorted(arr1: number[], arr2: number[]): number[] {
    const result: number[] = [];
    let i: number = 0, j: number = 0;
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            result.push(arr1[i++]);
        } else {
            result.push(arr2[j++]);
        }
    }
    return result.concat(arr1.slice(i)).concat(arr2.slice(j));
}`,explanation:"合并有序数组"},{id:"ts_arr_004",type:"copy",difficulty:2,code:`function removeDuplicates<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}`,explanation:"泛型去重"},{id:"ts_arr_005",type:"copy",difficulty:1,code:`const arr: number[] = [3, 1, 4, 1, 5, 9];
arr.sort((a, b) => a - b);
console.log(arr);`,explanation:"数字排序"},{id:"ts_arr_006",type:"copy",difficulty:2,code:`function chunk<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}`,explanation:"泛型数组分块"},{id:"ts_arr_007",type:"copy",difficulty:2,code:`const matrix: number[][] = [[1, 2], [3, 4], [5, 6]];
const flat: number[] = matrix.reduce((acc, row) => acc.concat(row), []);`,explanation:"二维数组扁平化"},{id:"ts_arr_008",type:"copy",difficulty:2,code:`function intersection<T>(arr1: T[], arr2: T[]): T[] {
    const set2 = new Set(arr2);
    return arr1.filter(x => set2.has(x));
}`,explanation:"泛型数组交集"},{id:"ts_arr_009",type:"copy",difficulty:2,code:`function difference<T>(arr1: T[], arr2: T[]): T[] {
    const set2 = new Set(arr2);
    return arr1.filter(x => !set2.has(x));
}`,explanation:"泛型数组差集"},{id:"ts_arr_010",type:"copy",difficulty:1,code:`const arr: number[] = [1, 2, 3, 4, 5];
const [first, second, ...rest]: number[] = arr;
console.log(first, second, rest);`,explanation:"解构赋值"},{id:"ts_arr_011",type:"copy",difficulty:2,code:`function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
    const length: number = Math.min(arr1.length, arr2.length);
    const result: [T, U][] = [];
    for (let i = 0; i < length; i++) {
        result.push([arr1[i], arr2[i]]);
    }
    return result;
}`,explanation:"泛型数组配对"},{id:"ts_arr_012",type:"copy",difficulty:3,code:`function quickSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const pivot: number = arr[0];
    const left: number[] = arr.slice(1).filter(x => x <= pivot);
    const right: number[] = arr.slice(1).filter(x => x > pivot);
    return [...quickSort(left), pivot, ...quickSort(right)];
}`,explanation:"快速排序"},{id:"ts_arr_013",type:"copy",difficulty:2,code:`function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
    return arr.reduce((groups, item) => {
        const key: string = keyFn(item);
        (groups[key] = groups[key] || []).push(item);
        return groups;
    }, {} as Record<string, T[]>);
}`,explanation:"泛型数组分组"},{id:"ts_arr_014",type:"copy",difficulty:1,code:`const arr1: number[] = [1, 2, 3];
const arr2: number[] = [4, 5, 6];
const combined: number[] = [...arr1, ...arr2];
console.log(combined);`,explanation:"展开运算符合并"},{id:"ts_arr_015",type:"copy",difficulty:2,code:`function rotate<T>(arr: T[], k: number): T[] {
    const n: number = arr.length;
    k = k % n;
    return [...arr.slice(-k), ...arr.slice(0, n - k)];
}`,explanation:"泛型数组旋转"},{id:"ts_arr_016",type:"copy",difficulty:2,code:`const arr: number[] = [1, 2, 3, 4, 5];
const hasThree: boolean = arr.includes(3);
const index: number = arr.indexOf(3);
const found: number | undefined = arr.find(x => x > 3);
const foundIndex: number = arr.findIndex(x => x > 3);`,explanation:"查找方法"},{id:"ts_arr_017",type:"copy",difficulty:3,code:`function permutations<T>(arr: T[]): T[][] {
    if (arr.length <= 1) return [arr];
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i++) {
        const rest: T[] = [...arr.slice(0, i), ...arr.slice(i + 1)];
        for (const perm of permutations(rest)) {
            result.push([arr[i], ...perm]);
        }
    }
    return result;
}`,explanation:"泛型全排列"},{id:"ts_arr_018",type:"copy",difficulty:2,code:`function compact<T>(arr: (T | null | undefined | false | 0 | '')[]): T[] {
    return arr.filter(Boolean) as T[];
}`,explanation:"过滤假值"},{id:"ts_arr_019",type:"copy",difficulty:2,code:`const arr: number[] = [1, 2, 3, 4, 5];
const sum: number = arr.reduce((acc, val) => acc + val, 0);
const avg: number = sum / arr.length;
const max: number = Math.max(...arr);
const min: number = Math.min(...arr);`,explanation:"统计计算"},{id:"ts_arr_020",type:"copy",difficulty:2,code:`function flattenDeep(arr: any[]): any[] {
    return arr.reduce((acc, val) =>
        Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    []);
}`,explanation:"深度扁平化"}],E={language:se,module:le,questions:pe},ue="TypeScript",de="string",fe=[{id:"ts_str_001",type:"copy",difficulty:1,code:`const str: string = 'Hello, World!';
console.log(str.length);
console.log(str.toUpperCase());
console.log(str.toLowerCase());`,explanation:"基本字符串方法"},{id:"ts_str_002",type:"copy",difficulty:1,code:`const str: string = 'Hello, World!';
console.log(str.slice(0, 5));
console.log(str.substring(7, 12));
console.log(str.indexOf('World'));`,explanation:"截取与查找"},{id:"ts_str_003",type:"copy",difficulty:2,code:`function reverseString(str: string): string {
    return str.split('').reverse().join('');
}`,explanation:"字符串反转"},{id:"ts_str_004",type:"copy",difficulty:2,code:`function countChar(str: string, char: string): number {
    return str.split('').filter(c => c === char).length;
}`,explanation:"字符计数"},{id:"ts_str_005",type:"copy",difficulty:1,code:"const name: string = 'Alice';\nconst greeting: string = `Hello, ${name}!`;\nconsole.log(greeting);",explanation:"模板字符串"},{id:"ts_str_006",type:"copy",difficulty:2,code:`function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}`,explanation:"首字母大写"},{id:"ts_str_007",type:"copy",difficulty:2,code:`function camelize(str: string): string {
    return str.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}`,explanation:"连字符转驼峰"},{id:"ts_str_008",type:"copy",difficulty:2,code:`function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
}`,explanation:"字符串截断"},{id:"ts_str_009",type:"copy",difficulty:2,code:`function isAnagram(str1: string, str2: string): boolean {
    const sort = (s: string): string => s.toLowerCase().split('').sort().join('');
    return sort(str1) === sort(str2);
}`,explanation:"变位词判断"},{id:"ts_str_010",type:"copy",difficulty:1,code:`const csv: string = 'apple,banana,cherry';
const fruits: string[] = csv.split(',');
const joined: string = fruits.join(' | ');`,explanation:"split和join"},{id:"ts_str_011",type:"copy",difficulty:2,code:`function repeat(str: string, n: number): string {
    return str.repeat(n);
}`,explanation:"字符串重复"},{id:"ts_str_012",type:"copy",difficulty:2,code:`function padLeft(str: string, length: number, char: string = ' '): string {
    return str.padStart(length, char);
}`,explanation:"左侧填充"},{id:"ts_str_013",type:"copy",difficulty:2,code:`function replaceAll(str: string, search: string, replacement: string): string {
    return str.split(search).join(replacement);
}`,explanation:"全部替换"},{id:"ts_str_014",type:"copy",difficulty:3,code:`function longestCommonPrefix(strs: string[]): string {
    if (strs.length === 0) return '';
    let prefix: string = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.slice(0, -1);
        }
    }
    return prefix;
}`,explanation:"最长公共前缀"},{id:"ts_str_015",type:"copy",difficulty:2,code:`function countWords(str: string): number {
    return str.trim().split(/\\s+/).length;
}`,explanation:"单词计数"},{id:"ts_str_016",type:"copy",difficulty:2,code:`function escapeHtml(str: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, c => map[c]);
}`,explanation:"HTML转义"},{id:"ts_str_017",type:"copy",difficulty:2,code:`function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\\s_]+/g, '-')
        .toLowerCase();
}`,explanation:"转连字符命名"},{id:"ts_str_018",type:"copy",difficulty:2,code:`function substringBetween(str: string, start: string, end: string): string {
    const s: number = str.indexOf(start);
    const e: number = str.indexOf(end, s + start.length);
    if (s === -1 || e === -1) return '';
    return str.substring(s + start.length, e);
}`,explanation:"提取子串"},{id:"ts_str_019",type:"copy",difficulty:3,code:`function isMatch(str: string, pattern: string): boolean {
    const dp: boolean[][] = Array(str.length + 1).fill(null)
        .map(() => Array(pattern.length + 1).fill(false));
    dp[0][0] = true;
    for (let j = 1; j <= pattern.length; j++) {
        if (pattern[j - 1] === '*') dp[0][j] = dp[0][j - 2];
    }
    for (let i = 1; i <= str.length; i++) {
        for (let j = 1; j <= pattern.length; j++) {
            if (pattern[j - 1] === '*') {
                dp[i][j] = dp[i][j - 2] ||
                    (str[i-1] === pattern[j-2] || pattern[j-2] === '.') && dp[i-1][j];
            } else {
                dp[i][j] = dp[i-1][j-1] &&
                    (pattern[j-1] === '.' || str[i-1] === pattern[j-1]);
            }
        }
    }
    return dp[str.length][pattern.length];
}`,explanation:"正则匹配（动态规划）"},{id:"ts_str_020",type:"copy",difficulty:2,code:`function parseQueryString(qs: string): Record<string, string> {
    return qs.slice(1).split('&').reduce((params, pair) => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        return params;
    }, {} as Record<string, string>);
}`,explanation:"解析查询字符串"}],ye={language:ue,module:de,questions:fe},me="TypeScript",_e="function",ge=[{id:"ts_func_001",type:"copy",difficulty:1,code:`function add(a: number, b: number): number {
    return a + b;
}
console.log(add(3, 5));`,explanation:"基础函数定义"},{id:"ts_func_002",type:"copy",difficulty:1,code:`const multiply = (a: number, b: number): number => a * b;
console.log(multiply(4, 5));`,explanation:"箭头函数"},{id:"ts_func_003",type:"copy",difficulty:2,code:`function sum(...nums: number[]): number {
    return nums.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3, 4));`,explanation:"rest参数"},{id:"ts_func_004",type:"copy",difficulty:2,code:`function greet(name: string = 'World'): string {
    return \`Hello, \${name}!\`;
}
console.log(greet());
console.log(greet('Alice'));`,explanation:"默认参数"},{id:"ts_func_005",type:"copy",difficulty:2,code:`function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
    let timer: ReturnType<typeof setTimeout>;
    return ((...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    }) as T;
}`,explanation:"泛型防抖函数"},{id:"ts_func_006",type:"copy",difficulty:2,code:`function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): T {
    let inThrottle: boolean = false;
    return ((...args: any[]) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }) as T;
}`,explanation:"泛型节流函数"},{id:"ts_func_007",type:"copy",difficulty:2,code:`function curry(fn: Function): Function {
    return function curried(...args: any[]): any {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return (...moreArgs: any[]) => curried(...args, ...moreArgs);
    };
}
const add3 = curry((a: number, b: number, c: number) => a + b + c);
console.log(add3(1)(2)(3));`,explanation:"函数柯里化"},{id:"ts_func_008",type:"copy",difficulty:3,code:`function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map<string, ReturnType<T>>();
    return ((...args: any[]) => {
        const key: string = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    }) as T;
}`,explanation:"泛型记忆化函数"},{id:"ts_func_009",type:"copy",difficulty:2,code:`type Fn = (x: number) => number;

function compose(...fns: Fn[]): Fn {
    return (x: number) => fns.reduceRight((acc, fn) => fn(acc), x);
}
const add1: Fn = (x: number) => x + 1;
const double: Fn = (x: number) => x * 2;
const add1ThenDouble: Fn = compose(double, add1);
console.log(add1ThenDouble(3));`,explanation:"函数组合（类型别名）"},{id:"ts_func_010",type:"copy",difficulty:2,code:`type Fn = (x: number) => number;

function pipe(...fns: Fn[]): Fn {
    return (x: number) => fns.reduce((acc, fn) => fn(acc), x);
}
const add1: Fn = (x: number) => x + 1;
const double: Fn = (x: number) => x * 2;
const doubleThenAdd1: Fn = pipe(double, add1);
console.log(doubleThenAdd1(3));`,explanation:"管道函数"},{id:"ts_func_011",type:"copy",difficulty:1,code:`interface Person {
    name: string;
    greet(): string;
}

const obj: Person = {
    name: 'Alice',
    greet() {
        return \`Hi, I'm \${this.name}\`;
    }
};
console.log(obj.greet());`,explanation:"接口与对象方法"},{id:"ts_func_012",type:"copy",difficulty:2,code:`function factorial(n: number): number {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
console.log(factorial(5));`,explanation:"递归阶乘"},{id:"ts_func_013",type:"copy",difficulty:2,code:`function fibonacci(n: number, memo: Record<number, number> = {}): number {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
    return memo[n];
}`,explanation:"记忆化斐波那契"},{id:"ts_func_014",type:"copy",difficulty:2,code:`function once<T extends (...args: any[]) => any>(fn: T): T {
    let called: boolean = false;
    let result: ReturnType<T>;
    return ((...args: any[]) => {
        if (!called) {
            result = fn(...args);
            called = true;
        }
        return result;
    }) as T;
}`,explanation:"泛型一次性函数"},{id:"ts_func_015",type:"copy",difficulty:2,code:`function retry<T>(fn: () => Promise<T>, maxAttempts: number = 3): Promise<T> {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const result = await fn();
                resolve(result);
                return;
            } catch (err) {
                if (i === maxAttempts - 1) reject(err);
            }
        }
    });
}`,explanation:"泛型重试函数"},{id:"ts_func_016",type:"copy",difficulty:2,code:`function partial<T extends (...args: any[]) => any>(fn: T, ...presetArgs: any[]): (...args: any[]) => ReturnType<T> {
    return (...laterArgs: any[]) => fn(...presetArgs, ...laterArgs);
}
const add = (a: number, b: number, c: number): number => a + b + c;
const add5 = partial(add, 5);
console.log(add5(3, 2));`,explanation:"偏函数"},{id:"ts_func_017",type:"copy",difficulty:3,code:`type EventHandler = (...args: any[]) => void;

class EventEmitter {
    private events: Record<string, EventHandler[]> = {};

    on(event: string, listener: EventHandler): this {
        (this.events[event] = this.events[event] || []).push(listener);
        return this;
    }

    emit(event: string, ...args: any[]): void {
        (this.events[event] || []).forEach(fn => fn(...args));
    }

    off(event: string, listener: EventHandler): void {
        this.events[event] = (this.events[event] || []).filter(fn => fn !== listener);
    }
}`,explanation:"事件发射器（类）"},{id:"ts_func_018",type:"copy",difficulty:2,code:`function range(start: number, end: number, step: number = 1): number[] {
    const result: number[] = [];
    for (let i = start; step > 0 ? i < end : i > end; i += step) {
        result.push(i);
    }
    return result;
}
console.log(range(1, 10, 2));`,explanation:"生成范围数组"},{id:"ts_func_019",type:"copy",difficulty:2,code:`function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    return keys.reduce((result, key) => {
        if (key in obj) result[key] = obj[key];
        return result;
    }, {} as Pick<T, K>);
}
const obj = { a: 1, b: 2, c: 3 };
console.log(pick(obj, ['a', 'c']));`,explanation:"泛型属性选取"},{id:"ts_func_020",type:"copy",difficulty:2,code:`function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    return Object.keys(obj)
        .filter(key => !keys.includes(key as K))
        .reduce((result, key) => {
            (result as any)[key] = obj[key as keyof T];
            return result;
        }, {} as Omit<T, K>);
}`,explanation:"泛型属性排除"}],S={language:me,module:_e,questions:ge},he="Linux",xe="loop",be=[{id:"linux_loop_001",type:"copy",difficulty:1,code:`for i in 1 2 3 4 5
  do
    echo $i
done`,explanation:"基础for循环"},{id:"linux_loop_002",type:"copy",difficulty:1,code:`i=0
while [ $i -lt 5 ]
  do
    echo $i
    i=$((i + 1))
done`,explanation:"while循环"},{id:"linux_loop_003",type:"copy",difficulty:2,code:`for file in /tmp/*.txt
  do
    if [ -f "$file" ]; then
      echo "Processing $file"
    fi
done`,explanation:"遍历文件"},{id:"linux_loop_004",type:"copy",difficulty:2,code:`count=0
for num in 2 3 5 7 11
  do
    count=$((count + num))
done
echo "Sum: $count"`,explanation:"累加求和"},{id:"linux_loop_005",type:"copy",difficulty:2,code:`i=1
while [ $i -le 10 ]
  do
    if [ $((i % 2)) -eq 0 ]; then
      echo "$i is even"
    fi
    i=$((i + 1))
done`,explanation:"条件判断"},{id:"linux_loop_006",type:"copy",difficulty:3,code:`find . -name "*.log" -type f | while read file
  do
    size=$(wc -c < "$file")
    echo "$file: $size bytes"
done`,explanation:"管道循环"},{id:"linux_loop_007",type:"copy",difficulty:2,code:`for i in $(seq 1 5)
  do
    for j in $(seq 1 $i)
      do
        echo -n "* "
    done
    echo
done`,explanation:"嵌套循环"},{id:"linux_loop_008",type:"copy",difficulty:3,code:`arr=(apple banana cherry date elderberry)
for fruit in "\${arr[@]}"
  do
    echo "Fruit: $fruit"
done
echo "Total: \${#arr[@]}"`,explanation:"数组遍历"},{id:"linux_loop_009",type:"copy",difficulty:2,code:`n=10
a=0
b=1
for i in $(seq 1 $n)
  do
    echo -n "$a "
    temp=$((a + b))
    a=$b
    b=$temp
done
echo`,explanation:"斐波那契数列"},{id:"linux_loop_010",type:"copy",difficulty:3,code:`is_prime() {
  local n=$1
  if [ $n -le 1 ]; then return 1; fi
  for ((i=2; i*i<=n; i++))
    do
      if [ $((n % i)) -eq 0 ]; then return 1; fi
  done
  return 0
}

for num in 2 3 4 5 6 7 8 9 10
  do
    if is_prime $num; then
      echo "$num is prime"
    fi
done`,explanation:"素数判断函数"},{id:"linux_loop_011",type:"copy",difficulty:1,code:`for i in {1..5}
  do
    echo "Number: $i"
done`,explanation:"范围循环"},{id:"linux_loop_012",type:"copy",difficulty:2,code:`read -p "Enter count: " n
sum=0
for ((i=1; i<=n; i++))
  do
    sum=$((sum + i))
done
echo "Sum of 1 to $n: $sum"`,explanation:"用户输入循环"},{id:"linux_loop_013",type:"copy",difficulty:3,code:`process_files() {
  local dir=$1
  local count=0
  for file in "$dir"/*
    do
      if [ -f "$file" ]; then
        count=$((count + 1))
      elif [ -d "$file" ]; then
        process_files "$file"
      fi
  done
  echo "$dir: $count files"
}

process_files /tmp`,explanation:"递归遍历目录"},{id:"linux_loop_014",type:"copy",difficulty:2,code:`declare -A scores
scores[alice]=85
scores[bob]=92
scores[charlie]=78

for name in "\${!scores[@]}"
  do
    echo "$name: \${scores[$name]}"
done`,explanation:"关联数组遍历"},{id:"linux_loop_015",type:"copy",difficulty:3,code:`generate_report() {
  local lines=()
  lines+=("Report Date: $(date)")
  lines+=("User: $(whoami)")
  lines+=("System: $(uname -a)")
  
  for line in "\${lines[@]}"
    do
      echo "$line"
  done
}

generate_report`,explanation:"数组构建与遍历"}],Ee={language:he,module:xe,questions:be},Se="Linux",Te="condition",$e=[{id:"linux_cond_001",type:"copy",difficulty:1,code:`x=10
if [ $x -gt 0 ]; then
  echo "Positive"
else
  echo "Negative"
fi`,explanation:"基础if判断"},{id:"linux_cond_002",type:"copy",difficulty:1,code:`age=20
if [ $age -ge 18 ]; then
  echo "Adult"
else
  echo "Minor"
fi`,explanation:"年龄判断"},{id:"linux_cond_003",type:"copy",difficulty:2,code:`score=85
if [ $score -ge 90 ]; then
  grade="A"
elif [ $score -ge 80 ]; then
  grade="B"
elif [ $score -ge 70 ]; then
  grade="C"
else
  grade="F"\fi
echo "Grade: $grade"`,explanation:"多分支判断"},{id:"linux_cond_004",type:"copy",difficulty:2,code:`file="/etc/passwd"
if [ -f "$file" ]; then
  echo "File exists"
  if [ -r "$file" ]; then
    echo "File is readable"
  fi
  if [ -w "$file" ]; then
    echo "File is writable"
  fi
else
  echo "File not found"
fi`,explanation:"文件属性检查"},{id:"linux_cond_005",type:"copy",difficulty:2,code:`str="Hello World"
if [ -z "$str" ]; then
  echo "String is empty"
elif [ \${#str} -gt 10 ]; then
  echo "String is long"
else
  echo "String length: \${#str}"
fi`,explanation:"字符串判断"},{id:"linux_cond_006",type:"copy",difficulty:3,code:`check_password() {
  local pass=$1
  local len=\${#pass}
  
  if [ $len -lt 8 ]; then
    echo "Too short"
    return 1
  fi
  
  if ! echo "$pass" | grep -q '[A-Z]'; then
    echo "Need uppercase"
    return 1
  fi
  
  if ! echo "$pass" | grep -q '[0-9]'; then
    echo "Need digit"
    return 1
  fi
  
  echo "Valid password"
  return 0
}

check_password "MyPass123"`,explanation:"密码验证函数"},{id:"linux_cond_007",type:"copy",difficulty:2,code:`year=2024
if [ $((year % 4)) -eq 0 ] && [ $((year % 100)) -ne 0 ] || [ $((year % 400)) -eq 0 ]; then
  echo "$year is leap year"
else
  echo "$year is not leap year"
fi`,explanation:"闰年判断"},{id:"linux_cond_008",type:"copy",difficulty:3,code:`validate_date() {
  local date=$1
  local year=\${date:0:4}
  local month=\${date:5:2}
  local day=\${date:8:2}
  
  if [ $month -lt 1 ] || [ $month -gt 12 ]; then
    return 1
  fi
  
  if [ $day -lt 1 ] || [ $day -gt 31 ]; then
    return 1
  fi
  
  return 0
}

validate_date "2024-03-15"
echo $?`,explanation:"日期验证函数"},{id:"linux_cond_009",type:"copy",difficulty:1,code:`num=7
if [ $((num % 2)) -eq 0 ]; then
  echo "Even"
else
  echo "Odd"
fi`,explanation:"奇偶判断"},{id:"linux_cond_010",type:"copy",difficulty:2,code:`a=10
b=20
c=30
max=$a
if [ $b -gt $max ]; then max=$b; fi
if [ $c -gt $max ]; then max=$c; fi
echo "Max: $max"`,explanation:"三数最大值"},{id:"linux_cond_011",type:"copy",difficulty:3,code:`classify_triangle() {
  local a=$1 b=$2 c=$3
  
  if [ $((a + b)) -le $c ] || [ $((a + c)) -le $b ] || [ $((b + c)) -le $a ]; then
    echo "Invalid"
    return
  fi
  
  if [ $a -eq $b ] && [ $b -eq $c ]; then
    echo "Equilateral"
  elif [ $a -eq $b ] || [ $b -eq $c ] || [ $a -eq $c ]; then
    echo "Isosceles"
  else
    echo "Scalene"
  fi
}

classify_triangle 3 4 5`,explanation:"三角形分类"},{id:"linux_cond_012",type:"copy",difficulty:2,code:`check_port() {
  local port=$1
  if ss -tuln | grep -q ":$port "; then
    echo "Port $port is in use"
  else
    echo "Port $port is free"
  fi
}

check_port 80`,explanation:"端口检查"},{id:"linux_cond_013",type:"copy",difficulty:2,code:`dir="/tmp"
if [ -d "$dir" ]; then
  file_count=$(find "$dir" -maxdepth 1 -type f | wc -l)
  echo "Files in $dir: $file_count"
else
  echo "Directory not found"
fi`,explanation:"目录检查"},{id:"linux_cond_014",type:"copy",difficulty:3,code:`compare_versions() {
  local v1=$1 v2=$2
  if [[ "$v1" == "$v2" ]]; then
    echo "Equal"
  elif [[ "$v1" > "$v2" ]]; then
    echo "$v1 is newer"
  else
    echo "$v2 is newer"
  fi
}

compare_versions "1.2.3" "1.2.4"`,explanation:"版本号比较"},{id:"linux_cond_015",type:"copy",difficulty:2,code:`user=$(whoami)
if [ "$user" = "root" ]; then
  echo "Running as root"
  echo "Be careful!"
else
  echo "Running as $user"
fi`,explanation:"用户权限检查"}],ve={language:Se,module:Te,questions:$e},we="Linux",Ne="array",je=[{id:"linux_arr_001",type:"copy",difficulty:1,code:'arr=(apple banana cherry date)\necho "First: ${arr[0]}"\necho "All: ${arr[@]}"\necho "Length: ${#arr[@]}"',explanation:"数组基础"},{id:"linux_arr_002",type:"copy",difficulty:1,code:`arr=()
arr+=("apple")
arr+=("banana")
arr+=("cherry")
echo "\${arr[@]}"`,explanation:"动态添加元素"},{id:"linux_arr_003",type:"copy",difficulty:2,code:`arr=(3 1 4 1 5 9 2 6)
max=\${arr[0]}
for num in "\${arr[@]}"
  do
    if [ $num -gt $max ]; then
      max=$num
    fi
done
echo "Max: $max"`,explanation:"查找最大值"},{id:"linux_arr_004",type:"copy",difficulty:2,code:`arr=(5 2 8 1 9 3 7)
sorted=($(printf '%s\\n' "\${arr[@]}" | sort -n))
echo "Sorted: \${sorted[@]}"`,explanation:"数组排序"},{id:"linux_arr_005",type:"copy",difficulty:2,code:`arr=(apple banana cherry date elderberry)
reversed=()
for ((i=\${#arr[@]}-1; i>=0; i--))
  do
    reversed+=("\${arr[i]}")
done
echo "\${reversed[@]}"`,explanation:"数组反转"},{id:"linux_arr_006",type:"copy",difficulty:3,code:`arr1=(1 3 5 7 9)
arr2=(2 4 6 8 10)
merged=()
i=0
j=0
while [ $i -lt \${#arr1[@]} ] && [ $j -lt \${#arr2[@]} ]
  do
    if [ \${arr1[$i]} -le \${arr2[$j]} ]; then
      merged+=(\${arr1[$i]})
      i=$((i + 1))
    else
      merged+=(\${arr2[$j]})
      j=$((j + 1))
    fi
done
while [ $i -lt \${#arr1[@]} ]; do merged+=(\${arr1[$i]}); i=$((i+1)); done
while [ $j -lt \${#arr2[@]} ]; do merged+=(\${arr2[$j]}); j=$((j+1)); done
echo "\${merged[@]}"`,explanation:"合并有序数组"},{id:"linux_arr_007",type:"copy",difficulty:2,code:`arr=(1 2 3 2 1 4 3 2 1)
declare -A seen
duplicates=()
for num in "\${arr[@]}"
  do
    if [ \${seen[$num]+_} ]; then
      duplicates+=($num)
    else
      seen[$num]=1
    fi
done
echo "Duplicates: \${duplicates[@]}"`,explanation:"查找重复元素"},{id:"linux_arr_008",type:"copy",difficulty:3,code:`arr=(1 2 3 4 5)
target=7
found=0
for ((i=0; i<\${#arr[@]}; i++))
  do
    for ((j=i+1; j<\${#arr[@]}; j++))
      do
        if [ $((\${arr[i]} + \${arr[j]})) -eq $target ]; then
          echo "Found: \${arr[i]} + \${arr[j]} = $target"
          found=1
        fi
    done
done
if [ $found -eq 0 ]; then echo "Not found"; fi`,explanation:"两数之和"},{id:"linux_arr_009",type:"copy",difficulty:2,code:`arr=(apple banana cherry)
for i in "\${!arr[@]}"
  do
    echo "Index $i: \${arr[$i]}"
done`,explanation:"遍历索引"},{id:"linux_arr_010",type:"copy",difficulty:3,code:`matrix=(
  "1 2 3"
  "4 5 6"
  "7 8 9"
)
for row in "\${matrix[@]}"
  do
    for val in $row
      do
        echo -n "$val "
    done
    echo
done`,explanation:"二维数组遍历"},{id:"linux_arr_011",type:"copy",difficulty:1,code:'arr=(3 1 4 1 5 9)\necho "Length: ${#arr[@]}"\necho "First: ${arr[0]}"\necho "Last: ${arr[-1]}"',explanation:"数组属性"},{id:"linux_arr_012",type:"copy",difficulty:2,code:'arr1=(1 2 3)\narr2=(4 5 6)\narr3=(${arr1[@]} ${arr2[@]})\necho "Merged: ${arr3[@]}"\necho "Length: ${#arr3[@]}"',explanation:"数组合并"},{id:"linux_arr_013",type:"copy",difficulty:3,code:`declare -A matrix
matrix[0,0]=1
matrix[0,1]=2
matrix[1,0]=3
matrix[1,1]=4

echo "Matrix:"
for ((i=0; i<2; i++))
  do
    for ((j=0; j<2; j++))
      do
        echo -n "\${matrix[$i,$j]} "
    done
    echo
done`,explanation:"关联数组矩阵"},{id:"linux_arr_014",type:"copy",difficulty:2,code:`arr=(5 2 8 1 9 3 7)
min=\${arr[0]}
min_idx=0
for i in "\${!arr[@]}"
  do
    if [ \${arr[$i]} -lt $min ]; then
      min=\${arr[$i]}
      min_idx=$i
    fi
done
echo "Min: $min at index $min_idx"`,explanation:"查找最小值索引"},{id:"linux_arr_015",type:"copy",difficulty:3,code:`declare -A frequency
arr=(a b c a b a d c a)
for item in "\${arr[@]}"
  do
    frequency[$item]=$(( \${frequency[$item]:-0} + 1 ))
done
for key in "\${!frequency[@]}"
  do
    echo "$key: \${frequency[$key]}"
done`,explanation:"频率统计"}],T={language:we,module:Ne,questions:je},Re="Linux",Ae="string",Ce=[{id:"linux_str_001",type:"copy",difficulty:1,code:'str="Hello World"\necho "Length: ${#str}"\necho "Upper: ${str^^}"\necho "Lower: ${str,,}"',explanation:"基础字符串操作"},{id:"linux_str_002",type:"copy",difficulty:1,code:`first="Hello"
second="World"
result="$first $second"
echo "$result"`,explanation:"字符串拼接"},{id:"linux_str_003",type:"copy",difficulty:2,code:'str="Hello World"\necho "Substring: ${str:6}"\necho "First 5: ${str:0:5}"\necho "Replace: ${str/World/Linux}"',explanation:"子串操作"},{id:"linux_str_004",type:"copy",difficulty:2,code:`email="user@example.com"
if [[ "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$ ]]; then
  echo "Valid email"
else
  echo "Invalid email"
fi`,explanation:"正则验证邮箱"},{id:"linux_str_005",type:"copy",difficulty:2,code:`str="  Hello World  "
echo "Original: '$str'"
echo "Trimmed: '\${str// /}'"
echo "Ltrimmed: '\${str# }'"
echo "Rtrimmed: '\${str% }'"`,explanation:"去除空格"},{id:"linux_str_006",type:"copy",difficulty:3,code:`count_chars() {
  local str=$1
  local char=$2
  local count=0
  for ((i=0; i<\${#str}; i++)); do
    if [ "\${str:$i:1}" = "$char" ]; then
      count=$((count + 1))
    fi
  done
  echo $count
}

echo "Count 'l': $(count_chars "Hello World" "l")"`,explanation:"字符计数函数"},{id:"linux_str_007",type:"copy",difficulty:2,code:`str="hello world"
result=""
for word in $str
  do
    first=\${word:0:1}
    rest=\${word:1}
    result+="\${first^^}\${rest} "
done
echo "\${result% }"`,explanation:"首字母大写"},{id:"linux_str_008",type:"copy",difficulty:3,code:`is_palindrome() {
  local str=\${1,,}
  local len=\${#str}
  for ((i=0; i<len/2; i++)); do
    if [ "\${str:$i:1}" != "\${str:$((len-1-i)):1}" ]; then
      return 1
    fi
  done
  return 0
}

is_palindrome "racecar" && echo "Palindrome" || echo "Not palindrome"`,explanation:"回文判断"},{id:"linux_str_009",type:"copy",difficulty:2,code:`str="Hello World Hello Linux"
count=0
pos=0
while [[ "$str" == *"Hello"* ]]; do
  count=$((count + 1))
  str="\${str#*Hello}"
done
echo "Occurrences: $count"`,explanation:"子串计数"},{id:"linux_str_010",type:"copy",difficulty:3,code:`split_string() {
  local str=$1
  local delimiter=$2
  local result=()
  local word=""
  for ((i=0; i<\${#str}; i++)); do
    local char="\${str:$i:1}"
    if [ "$char" = "$delimiter" ]; then
      result+=("$word")
      word=""
    else
      word+="$char"
    fi
  done
  result+=("$word")
  echo "\${result[@]}"
}

split_string "apple,banana,cherry" ","`,explanation:"字符串分割"},{id:"linux_str_011",type:"copy",difficulty:1,code:`str="Hello World"
if [[ "$str" == *"World"* ]]; then
  echo "Contains World"
fi
if [[ "$str" == "Hello"* ]]; then
  echo "Starts with Hello"
fi`,explanation:"模式匹配"},{id:"linux_str_012",type:"copy",difficulty:2,code:`reverse_string() {
  local str=$1
  local reversed=""
  for ((i=\${#str}-1; i>=0; i--)); do
    reversed+="\${str:$i:1}"
  done
  echo "$reversed"
}

echo $(reverse_string "Hello")`,explanation:"字符串反转"},{id:"linux_str_013",type:"copy",difficulty:3,code:`compress_string() {
  local str=$1
  local result=""
  local count=1
  local prev="\${str:0:1}"
  for ((i=1; i<\${#str}; i++)); do
    local curr="\${str:$i:1}"
    if [ "$curr" = "$prev" ]; then
      count=$((count + 1))
    else
      result+="$prev$count"
      prev=$curr
      count=1
    fi
  done
  result+="$prev$count"
  echo "$result"
}

echo $(compress_string "aabbbcccc")`,explanation:"字符串压缩"},{id:"linux_str_014",type:"copy",difficulty:2,code:`str="Hello123World456"
digits=""
for ((i=0; i<\${#str}; i++)); do
  char="\${str:$i:1}"
  if [[ "$char" =~ [0-9] ]]; then
    digits+="$char"
  fi
done
echo "Digits: $digits"`,explanation:"提取数字"},{id:"linux_str_015",type:"copy",difficulty:3,code:`caesar_cipher() {
  local str=$1
  local shift=$2
  local result=""
  for ((i=0; i<\${#str}; i++)); do
    local char="\${str:$i:1}"
    if [[ "$char" =~ [a-z] ]]; then
      local code=$(( $(printf '%d' "'$char") - 97 ))
      code=$(( (code + shift) % 26 + 97 ))
      result+=$(printf '\\$(printf '%03o' $code))
    else
      result+="$char"
    fi
  done
  echo "$result"
}

echo $(caesar_cipher "abc" 3)`,explanation:"凯撒密码"}],Le={language:Re,module:Ae,questions:Ce},ke="Linux",Oe="function",He=[{id:"linux_func_001",type:"copy",difficulty:1,code:`greet() {
  echo "Hello, $1!"
}

greet "World"`,explanation:"基础函数"},{id:"linux_func_002",type:"copy",difficulty:1,code:`add() {
  local a=$1
  local b=$2
  echo $((a + b))
}

result=$(add 3 5)
echo "Sum: $result"`,explanation:"带参数函数"},{id:"linux_func_003",type:"copy",difficulty:2,code:`factorial() {
  local n=$1
  if [ $n -le 1 ]; then
    echo 1
    return
  fi
  local prev=$(factorial $((n - 1)))
  echo $((n * prev))
}

echo $(factorial 5)`,explanation:"递归阶乘"},{id:"linux_func_004",type:"copy",difficulty:2,code:`fibonacci() {
  local n=$1
  local a=0
  local b=1
  for ((i=0; i<n; i++)); do
    echo -n "$a "
    local temp=$((a + b))
    a=$b
    b=$temp
  done
  echo
}

fibonacci 10`,explanation:"斐波那契函数"},{id:"linux_func_005",type:"copy",difficulty:3,code:`is_prime() {
  local n=$1
  if [ $n -le 1 ]; then return 1; fi
  for ((i=2; i*i<=n; i++)); do
    if [ $((n % i)) -eq 0 ]; then return 1; fi
  done
  return 0
}

primes=()
for ((i=2; i<=50; i++)); do
  if is_prime $i; then
    primes+=($i)
  fi
done
echo "Primes: \${primes[@]}"`,explanation:"素数筛选函数"},{id:"linux_func_006",type:"copy",difficulty:2,code:`max() {
  local result=$1
  shift
  for num in "$@"; do
    if [ $num -gt $result ]; then
      result=$num
    fi
  done
  echo $result
}

echo $(max 3 7 2 8 1)`,explanation:"可变参数最大值"},{id:"linux_func_007",type:"copy",difficulty:3,code:`quicksort() {
  local -n arr=$1
  local low=$2
  local high=$3
  
  if [ $low -lt $high ]; then
    local pivot=\${arr[$high]}
    local i=$((low - 1))
    
    for ((j=low; j<high; j++)); do
      if [ \${arr[$j]} -le $pivot ]; then
        i=$((i + 1))
        local temp=\${arr[$i]}
        arr[$i]=\${arr[$j]}
        arr[$j]=$temp
      fi
    done
    
    i=$((i + 1))
    local temp=\${arr[$i]}
    arr[$i]=\${arr[$high]}
    arr[$high]=$temp
    
    quicksort arr $low $((i - 1))
    quicksort arr $((i + 1)) $high
  fi
}

arr=(5 2 8 1 9 3)
quicksort arr 0 $((\${#arr[@]} - 1))
echo "\${arr[@]}"`,explanation:"快速排序"},{id:"linux_func_008",type:"copy",difficulty:2,code:`validate_email() {
  local email=$1
  if [[ "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$ ]]; then
    return 0
  fi
  return 1
}

validate_email "user@example.com"
echo $?`,explanation:"邮箱验证函数"},{id:"linux_func_009",type:"copy",difficulty:3,code:`memoize() {
  local func=$1
  shift
  local key="$func:$*"
  
  if [ -n "\${_memo_cache[$key]+_}" ]; then
    echo "\${_memo_cache[$key]}"
    return
  fi
  
  local result=$($func "$@")
  _memo_cache[$key]=$result
  echo $result
}

declare -A _memo_cache
heavy_calc() { sleep 1; echo $(($1 * $1)); }
echo $(memoize heavy_calc 5)
echo $(memoize heavy_calc 5)`,explanation:"记忆化函数"},{id:"linux_func_010",type:"copy",difficulty:2,code:`retry() {
  local max_attempts=$1
  shift
  local command="$@"
  
  for ((attempt=1; attempt<=max_attempts; attempt++)); do
    if eval "$command"; then
      return 0
    fi
    echo "Attempt $attempt failed, retrying..."
    sleep 1
  done
  return 1
}

retry 3 "ping -c 1 localhost"`,explanation:"重试函数"},{id:"linux_func_011",type:"copy",difficulty:1,code:`is_even() {
  local n=$1
  if [ $((n % 2)) -eq 0 ]; then
    return 0
  fi
  return 1
}

is_even 4 && echo "Even" || echo "Odd"`,explanation:"布尔返回值"},{id:"linux_func_012",type:"copy",difficulty:2,code:`map() {
  local func=$1
  shift
  local result=()
  for item in "$@"; do
    result+=($($func $item))
  done
  echo "\${result[@]}"
}

square() { echo $(($1 * $1)); }
echo $(map square 1 2 3 4 5)`,explanation:"map函数"},{id:"linux_func_013",type:"copy",difficulty:3,code:`filter() {
  local predicate=$1
  shift
  local result=()
  for item in "$@"; do
    if $predicate $item; then
      result+=($item)
    fi
  done
  echo "\${result[@]}"
}

is_positive() { [ $1 -gt 0 ] && return 0 || return 1; }
echo $(filter is_positive -3 5 -1 7 2)`,explanation:"filter函数"},{id:"linux_func_014",type:"copy",difficulty:2,code:`cache_result() {
  local cache_file="/tmp/cache_$1"
  if [ -f "$cache_file" ]; then
    cat "$cache_file"
    return
  fi
  local result=$("$@")
  echo "$result" > "$cache_file"
  echo "$result"
}

expensive_calc() { echo $(( $1 * $1 + $1 )); }
echo $(cache_result expensive_calc 42)`,explanation:"文件缓存"},{id:"linux_func_015",type:"copy",difficulty:3,code:`compose() {
  local funcs=("$@")
  echo "$(
    input=$(cat)
    for func in "\${funcs[@]}"; do
      input=$(echo "$input" | $func)
    done
    echo "$input"
  )"
}

toupper() { tr '[:lower:]' '[:upper:]'; }
trim() { sed 's/^[[:space:]]*//;s/[[:space:]]*$//'; }

echo "  hello world  " | compose trim toupper`,explanation:"函数组合"}],$={language:ke,module:Oe,questions:He},Ie="SQL",qe="loop",Me=[{id:"sql_loop_001",type:"copy",difficulty:1,code:`SELECT * FROM users
WHERE age > 18;`,explanation:"基础查询"},{id:"sql_loop_002",type:"copy",difficulty:1,code:`SELECT name, age
FROM users
ORDER BY age DESC
LIMIT 10;`,explanation:"排序限制"},{id:"sql_loop_003",type:"copy",difficulty:2,code:`SELECT department, COUNT(*) as count
FROM employees
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY count DESC;`,explanation:"分组统计"},{id:"sql_loop_004",type:"copy",difficulty:2,code:`SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 0;`,explanation:"连接查询"},{id:"sql_loop_005",type:"copy",difficulty:2,code:`SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;`,explanation:"子查询"},{id:"sql_loop_006",type:"copy",difficulty:3,code:`WITH ranked AS (
  SELECT name, salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) as rank
  FROM employees
)
SELECT name, salary, rank
FROM ranked
WHERE rank <= 3;`,explanation:"窗口函数"},{id:"sql_loop_007",type:"copy",difficulty:2,code:`SELECT
  CASE
    WHEN score >= 90 THEN 'A'
    WHEN score >= 80 THEN 'B'
    WHEN score >= 70 THEN 'C'
    WHEN score >= 60 THEN 'D'
    ELSE 'F'
  END as grade,
  COUNT(*) as count
FROM students
GROUP BY grade
ORDER BY grade;`,explanation:"CASE表达式"},{id:"sql_loop_008",type:"copy",difficulty:3,code:`SELECT DISTINCT a.name
FROM users a
INNER JOIN friends f1 ON a.id = f1.user_id
INNER JOIN friends f2 ON f1.friend_id = f2.user_id
INNER JOIN users b ON f2.friend_id = b.id
WHERE b.name = 'Alice' AND a.id != b.id;`,explanation:"多表连接"},{id:"sql_loop_009",type:"copy",difficulty:2,code:`SELECT DATE_FORMAT(created_at, '%Y-%m') as month,
       SUM(amount) as total
FROM transactions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
GROUP BY month
ORDER BY month;`,explanation:"日期分组"},{id:"sql_loop_010",type:"copy",difficulty:3,code:`WITH RECURSIVE tree AS (
  SELECT id, name, parent_id, 0 as level
  FROM categories
  WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.parent_id, t.level + 1
  FROM categories c
  INNER JOIN tree t ON c.parent_id = t.id
)
SELECT id, name, level FROM tree ORDER BY level, name;`,explanation:"递归查询"},{id:"sql_loop_011",type:"copy",difficulty:1,code:`SELECT name, email
FROM users
WHERE email LIKE '%@gmail.com'
ORDER BY name;`,explanation:"模式匹配"},{id:"sql_loop_012",type:"copy",difficulty:2,code:`SELECT p.name, SUM(oi.quantity * oi.price) as revenue
FROM products p
INNER JOIN order_items oi ON p.id = oi.product_id
INNER JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY p.id, p.name
ORDER BY revenue DESC
LIMIT 5;`,explanation:"聚合计算"},{id:"sql_loop_013",type:"copy",difficulty:3,code:`SELECT user_id,
       SUM(CASE WHEN action = 'login' THEN 1 ELSE 0 END) as logins,
       SUM(CASE WHEN action = 'purchase' THEN 1 ELSE 0 END) as purchases,
       SUM(CASE WHEN action = 'logout' THEN 1 ELSE 0 END) as logouts
FROM user_actions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY user_id
ORDER BY logins DESC;`,explanation:"条件聚合"},{id:"sql_loop_014",type:"copy",difficulty:2,code:`SELECT name,
       salary,
       RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank
FROM employees
WHERE department IN ('Engineering', 'Marketing');`,explanation:"分组排名"},{id:"sql_loop_015",type:"copy",difficulty:3,code:`WITH daily_revenue AS (
  SELECT DATE(created_at) as date,
         SUM(amount) as revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY DATE(created_at)
)
SELECT date,
       revenue,
       AVG(revenue) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg
FROM daily_revenue
ORDER BY date;`,explanation:"移动平均"}],De={language:Ie,module:qe,questions:Me},Fe="SQL",We="condition",Ue=[{id:"sql_cond_001",type:"copy",difficulty:1,code:`SELECT name,
       CASE WHEN age >= 18 THEN 'Adult' ELSE 'Minor' END as status
FROM users;`,explanation:"简单CASE"},{id:"sql_cond_002",type:"copy",difficulty:1,code:`SELECT name, salary,
       CASE
         WHEN salary >= 100000 THEN 'High'
         WHEN salary >= 50000 THEN 'Medium'
         ELSE 'Low'
       END as level
FROM employees;`,explanation:"多条件CASE"},{id:"sql_cond_003",type:"copy",difficulty:2,code:`SELECT product_name,
       price,
       CASE
         WHEN stock = 0 THEN 'Out of Stock'
         WHEN stock < 10 THEN 'Low Stock'
         ELSE 'In Stock'
       END as availability
FROM products
ORDER BY stock ASC;`,explanation:"库存状态判断"},{id:"sql_cond_004",type:"copy",difficulty:2,code:`SELECT name,
       COALESCE(phone, email, 'No Contact') as contact
FROM users
ORDER BY name;`,explanation:"COALESCE空值处理"},{id:"sql_cond_005",type:"copy",difficulty:2,code:`SELECT order_id,
       total,
       CASE
         WHEN total >= 100 THEN total * 0.1
         WHEN total >= 50 THEN total * 0.05
         ELSE 0
       END as discount,
       total - CASE
         WHEN total >= 100 THEN total * 0.1
         WHEN total >= 50 THEN total * 0.05
         ELSE 0
       END as final_price
FROM orders;`,explanation:"折扣计算"},{id:"sql_cond_006",type:"copy",difficulty:3,code:`SELECT u.name,
       CASE
         WHEN COUNT(o.id) >= 10 THEN 'VIP'
         WHEN COUNT(o.id) >= 5 THEN 'Regular'
         ELSE 'New'
       END as customer_type
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;`,explanation:"客户分类"},{id:"sql_cond_007",type:"copy",difficulty:2,code:`SELECT name,
       score,
       RANK() OVER (ORDER BY score DESC) as rank,
       CASE
         WHEN score >= 90 THEN 'A'
         WHEN score >= 80 THEN 'B'
         WHEN score >= 70 THEN 'C'
         ELSE 'D'
       END as grade
FROM students;`,explanation:"成绩等级"},{id:"sql_cond_008",type:"copy",difficulty:3,code:`SELECT product_name,
       price,
       CASE
         WHEN price > AVG(price) OVER () THEN 'Above Average'
         WHEN price = AVG(price) OVER () THEN 'Average'
         ELSE 'Below Average'
       END as price_category
FROM products;`,explanation:"价格分类"},{id:"sql_cond_009",type:"copy",difficulty:1,code:`SELECT name,
       IF(active = 1, 'Active', 'Inactive') as status
FROM users;`,explanation:"IF函数"},{id:"sql_cond_010",type:"copy",difficulty:2,code:`SELECT name,
       IFNULL(phone, 'N/A') as phone,
       IFNULL(email, 'N/A') as email
FROM contacts;`,explanation:"IFNULL空值处理"},{id:"sql_cond_011",type:"copy",difficulty:3,code:`SELECT order_id,
       created_at,
       CASE
         WHEN DATEDIFF(NOW(), created_at) <= 1 THEN 'Today'
         WHEN DATEDIFF(NOW(), created_at) <= 7 THEN 'This Week'
         WHEN DATEDIFF(NOW(), created_at) <= 30 THEN 'This Month'
         ELSE 'Older'
       END as time_category
FROM orders;`,explanation:"时间分类"},{id:"sql_cond_012",type:"copy",difficulty:2,code:`SELECT name,
       CASE gender
         WHEN 'M' THEN 'Male'
         WHEN 'F' THEN 'Female'
         ELSE 'Other'
       END as gender_display
FROM users;`,explanation:"简单CASE映射"},{id:"sql_cond_013",type:"copy",difficulty:3,code:`SELECT u.name,
       CASE
         WHEN MAX(o.total) >= 1000 THEN 'Premium'
         WHEN MAX(o.total) >= 100 THEN 'Standard'
         WHEN COUNT(o.id) > 0 THEN 'Basic'
         ELSE 'No Orders'
       END as tier
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;`,explanation:"用户等级"},{id:"sql_cond_014",type:"copy",difficulty:2,code:`SELECT name,
       CASE
         WHEN age < 13 THEN 'Child'
         WHEN age < 18 THEN 'Teen'
         WHEN age < 65 THEN 'Adult'
         ELSE 'Senior'
       END as age_group,
       COUNT(*) as count
FROM users
GROUP BY age_group
ORDER BY age_group;`,explanation:"年龄分组"},{id:"sql_cond_015",type:"copy",difficulty:3,code:`SELECT product_name,
       price,
       CASE
         WHEN price < 10 THEN 'Budget'
         WHEN price < 50 THEN 'Mid-range'
         WHEN price < 200 THEN 'Premium'
         ELSE 'Luxury'
       END as category,
       CASE
         WHEN stock = 0 THEN '🔴'
         WHEN stock < 5 THEN '🟡'
         ELSE '🟢'
       END as stock_indicator
FROM products
ORDER BY price;`,explanation:"多维度分类"}],Pe={language:Fe,module:We,questions:Ue},Be="SQL",ze="array",Ge=[{id:"sql_arr_001",type:"copy",difficulty:1,code:`SELECT id, name, email
FROM users
WHERE id IN (1, 2, 3, 4, 5);`,explanation:"IN 查询"},{id:"sql_arr_002",type:"copy",difficulty:1,code:`SELECT name, tags
FROM products
WHERE tags IS NOT NULL AND tags != '';`,explanation:"非空判断"},{id:"sql_arr_003",type:"copy",difficulty:2,code:`SELECT name,
       JSON_EXTRACT(tags, '$[0]') as first_tag,
       JSON_LENGTH(tags) as tag_count
FROM products
WHERE JSON_VALID(tags) = 1;`,explanation:"JSON数组操作"},{id:"sql_arr_004",type:"copy",difficulty:2,code:`SELECT user_id,
       GROUP_CONCAT(DISTINCT tag SEPARATOR ', ') as tags
FROM user_tags
GROUP BY user_id
ORDER BY user_id;`,explanation:"聚合为数组"},{id:"sql_arr_005",type:"copy",difficulty:3,code:`SELECT p.name,
       ARRAY_AGG(DISTINCT c.name) as categories
FROM products p
LEFT JOIN product_categories pc ON p.id = pc.product_id
LEFT JOIN categories c ON pc.category_id = c.id
GROUP BY p.id, p.name;`,explanation:"聚合关联数据"},{id:"sql_arr_006",type:"copy",difficulty:2,code:`SELECT name,
       STRING_TO_ARRAY(tags, ',') as tag_array,
       ARRAY_LENGTH(STRING_TO_ARRAY(tags, ','), 1) as count
FROM products
WHERE tags IS NOT NULL;`,explanation:"字符串转数组"},{id:"sql_arr_007",type:"copy",difficulty:3,code:`SELECT name,
       tags @> ARRAY['featured'] as is_featured,
       tags && ARRAY['sale', 'discount'] as on_sale,
       ARRAY_LENGTH(tags, 1) as tag_count
FROM products
WHERE tags IS NOT NULL;`,explanation:"PostgreSQL数组操作"},{id:"sql_arr_008",type:"copy",difficulty:2,code:`SELECT user_id,
       ARRAY_AGG(action ORDER BY created_at DESC) as recent_actions
FROM user_actions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY user_id
HAVING COUNT(*) >= 3;`,explanation:"聚合排序"},{id:"sql_arr_009",type:"copy",difficulty:3,code:`SELECT name,
       JSON_ARRAYAGG(
         JSON_OBJECT(
           'id', o.id,
           'total', o.total,
           'date', o.created_at
         ) ORDER BY o.created_at DESC
       ) as orders
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;`,explanation:"JSON数组聚合"},{id:"sql_arr_010",type:"copy",difficulty:2,code:`SELECT name,
       CASE
         WHEN JSON_CONTAINS(interests, '"coding"') THEN 'Developer'
         WHEN JSON_CONTAINS(interests, '"design"') THEN 'Designer'
         ELSE 'Other'
       END as role
FROM users
WHERE interests IS NOT NULL;`,explanation:"JSON包含查询"},{id:"sql_arr_011",type:"copy",difficulty:1,code:`SELECT DISTINCT category
FROM products
WHERE category IS NOT NULL
ORDER BY category;`,explanation:"去重查询"},{id:"sql_arr_012",type:"copy",difficulty:2,code:`SELECT user_id,
       COUNT(DISTINCT action) as unique_actions,
       COUNT(*) as total_actions
FROM user_actions
GROUP BY user_id
ORDER BY unique_actions DESC;`,explanation:"去重统计"},{id:"sql_arr_013",type:"copy",difficulty:3,code:`SELECT u.name,
       ARRAY(
         SELECT DISTINCT p.name
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         JOIN products p ON oi.product_id = p.id
         WHERE o.user_id = u.id
       ) as purchased_products
FROM users u
WHERE u.id IN (SELECT DISTINCT user_id FROM orders);`,explanation:"子查询数组"},{id:"sql_arr_014",type:"copy",difficulty:2,code:`SELECT category,
       ARRAY_AGG(name ORDER BY price DESC) as products,
       AVG(price) as avg_price
FROM products
GROUP BY category
ORDER BY avg_price DESC;`,explanation:"分组聚合"},{id:"sql_arr_015",type:"copy",difficulty:3,code:`SELECT user_id,
       SUM(CASE WHEN action = 'click' THEN 1 ELSE 0 END) as clicks,
       SUM(CASE WHEN action = 'view' THEN 1 ELSE 0 END) as views,
       SUM(CASE WHEN action = 'purchase' THEN 1 ELSE 0 END) as purchases,
       ARRAY_AGG(DISTINCT page ORDER BY page) as visited_pages
FROM user_actions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY user_id
ORDER BY purchases DESC
LIMIT 10;`,explanation:"多维度聚合"}],v={language:Be,module:ze,questions:Ge},Ve="SQL",Ye="string",Je=[{id:"sql_str_001",type:"copy",difficulty:1,code:`SELECT name,
       UPPER(name) as upper,
       LOWER(name) as lower,
       LENGTH(name) as length
FROM users;`,explanation:"基础字符串函数"},{id:"sql_str_002",type:"copy",difficulty:1,code:`SELECT CONCAT(first_name, ' ', last_name) as full_name
FROM users
WHERE first_name IS NOT NULL;`,explanation:"字符串拼接"},{id:"sql_str_003",type:"copy",difficulty:2,code:`SELECT email,
       SUBSTRING(email, 1, POSITION('@' IN email) - 1) as username,
       SUBSTRING(email, POSITION('@' IN email) + 1) as domain
FROM users
WHERE email LIKE '%@%';`,explanation:"字符串截取"},{id:"sql_str_004",type:"copy",difficulty:2,code:`SELECT name,
       TRIM(name) as trimmed,
       LTRIM(name) as ltrimmed,
       RTRIM(name) as rtrimmed
FROM users
WHERE name LIKE ' %' OR name LIKE '% ';`,explanation:"去除空格"},{id:"sql_str_005",type:"copy",difficulty:2,code:`SELECT name,
       REPLACE(name, ' ', '_') as no_spaces,
       REPLACE(LOWER(name), ' ', '-') as slug
FROM products;`,explanation:"字符串替换"},{id:"sql_str_006",type:"copy",difficulty:3,code:`SELECT name,
       CASE
         WHEN email LIKE '%@gmail.com' THEN 'Gmail'
         WHEN email LIKE '%@yahoo.com' THEN 'Yahoo'
         WHEN email LIKE '%@outlook.com' THEN 'Outlook'
         ELSE 'Other'
       END as email_provider,
       COUNT(*) OVER (PARTITION BY CASE
         WHEN email LIKE '%@gmail.com' THEN 'Gmail'
         WHEN email LIKE '%@yahoo.com' THEN 'Yahoo'
         ELSE 'Other'
       END) as provider_count
FROM users
WHERE email IS NOT NULL;`,explanation:"模式匹配统计"},{id:"sql_str_007",type:"copy",difficulty:2,code:`SELECT name,
       REVERSE(name) as reversed,
       REPEAT('*', LENGTH(password)) as masked_password
FROM users;`,explanation:"字符串操作"},{id:"sql_str_008",type:"copy",difficulty:3,code:`SELECT name,
       CASE
         WHEN REGEXP_LIKE(email, '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
         THEN 'Valid'
         ELSE 'Invalid'
       END as email_status
FROM users
WHERE email IS NOT NULL;`,explanation:"正则验证"},{id:"sql_str_009",type:"copy",difficulty:2,code:`SELECT name,
       LEFT(name, 3) as prefix,
       RIGHT(name, 3) as suffix,
       CHAR_LENGTH(name) as char_length
FROM products;`,explanation:"子串提取"},{id:"sql_str_010",type:"copy",difficulty:3,code:`SELECT
  GROUP_CONCAT(
    CASE
      WHEN score >= 90 THEN CONCAT(name, ' (A)')
      WHEN score >= 80 THEN CONCAT(name, ' (B)')
      ELSE CONCAT(name, ' (C)')
    END
    ORDER BY score DESC
    SEPARATOR ', '
  ) as honor_roll
FROM students
WHERE score >= 70;`,explanation:"条件聚合字符串"},{id:"sql_str_011",type:"copy",difficulty:1,code:`SELECT name,
       LENGTH(name) > 10 as is_long_name
FROM users;`,explanation:"长度判断"},{id:"sql_str_012",type:"copy",difficulty:2,code:`SELECT description,
       SUBSTRING_INDEX(description, '.', 1) as first_sentence,
       LENGTH(description) - LENGTH(REPLACE(description, ' ', '')) + 1 as word_count
FROM articles;`,explanation:"文本分析"},{id:"sql_str_013",type:"copy",difficulty:3,code:`SELECT
  LPAD('*', 5 - FLOOR(LENGTH(CAST(score AS CHAR)) / 20), '*') as rating,
  name,
  score
FROM (
  SELECT name, AVG(score) as score
  FROM reviews
  GROUP BY name
) sub
ORDER BY score DESC;`,explanation:"文本评级"},{id:"sql_str_014",type:"copy",difficulty:2,code:`SELECT name,
       COALESCE(NULLIF(phone, ''), 'N/A') as phone,
       COALESCE(NULLIF(email, ''), 'N/A') as email
FROM contacts;`,explanation:"NULL处理"},{id:"sql_str_015",type:"copy",difficulty:3,code:`SELECT
  CONCAT(
    UPPER(LEFT(first_name, 1)),
    LOWER(SUBSTRING(first_name, 2)),
    ' ',
    UPPER(LEFT(last_name, 1)),
    LOWER(SUBSTRING(last_name, 2))
  ) as formatted_name,
  email
FROM users
WHERE first_name IS NOT NULL AND last_name IS NOT NULL;`,explanation:"格式化姓名"}],Ke={language:Ve,module:Ye,questions:Je},Qe="SQL",Ze="function",Xe=[{id:"sql_func_001",type:"copy",difficulty:1,code:`CREATE FUNCTION add_numbers(a INT, b INT)
RETURNS INT
BEGIN
  RETURN a + b;
END;`,explanation:"基础函数"},{id:"sql_func_002",type:"copy",difficulty:1,code:`CREATE FUNCTION get_full_name(first_name VARCHAR(50), last_name VARCHAR(50))
RETURNS VARCHAR(101)
BEGIN
  RETURN CONCAT(first_name, ' ', last_name);
END;`,explanation:"字符串函数"},{id:"sql_func_003",type:"copy",difficulty:2,code:`CREATE FUNCTION calculate_age(birth_date DATE)
RETURNS INT
BEGIN
  RETURN TIMESTAMPDIFF(YEAR, birth_date, CURDATE());
END;

SELECT name, calculate_age(birth_date) as age FROM users;`,explanation:"日期计算函数"},{id:"sql_func_004",type:"copy",difficulty:2,code:`CREATE FUNCTION get_grade(score INT)
RETURNS CHAR(1)
BEGIN
  RETURN CASE
    WHEN score >= 90 THEN 'A'
    WHEN score >= 80 THEN 'B'
    WHEN score >= 70 THEN 'C'
    WHEN score >= 60 THEN 'D'
    ELSE 'F'
  END;
END;

SELECT name, get_grade(score) as grade FROM students;`,explanation:"条件函数"},{id:"sql_func_005",type:"copy",difficulty:3,code:`CREATE FUNCTION fibonacci(n INT)
RETURNS INT
BEGIN
  DECLARE a INT DEFAULT 0;
  DECLARE b INT DEFAULT 1;
  DECLARE i INT DEFAULT 0;
  DECLARE temp INT;
  
  WHILE i < n DO
    SET temp = a + b;
    SET a = b;
    SET b = temp;
    SET i = i + 1;
  END WHILE;
  
  RETURN a;
END;`,explanation:"迭代斐波那契"},{id:"sql_func_006",type:"copy",difficulty:2,code:`CREATE FUNCTION is_palindrome(str VARCHAR(255))
RETURNS BOOLEAN
BEGIN
  RETURN str = REVERSE(str);
END;

SELECT is_palindrome('racecar') as result;`,explanation:"回文判断"},{id:"sql_func_007",type:"copy",difficulty:3,code:`CREATE FUNCTION factorial(n INT)
RETURNS INT
BEGIN
  IF n <= 1 THEN RETURN 1;
  END IF;
  RETURN n * factorial(n - 1);
END;

SELECT factorial(5) as result;`,explanation:"递归阶乘"},{id:"sql_func_008",type:"copy",difficulty:2,code:`CREATE FUNCTION count_words(text VARCHAR(1000))
RETURNS INT
BEGIN
  DECLARE count INT DEFAULT 0;
  DECLARE pos INT DEFAULT 1;
  
  WHILE pos <= LENGTH(text) DO
    IF SUBSTRING(text, pos, 1) = ' ' THEN
      SET count = count + 1;
    END IF;
    SET pos = pos + 1;
  END WHILE;
  
  RETURN count + 1;
END;`,explanation:"单词计数"},{id:"sql_func_009",type:"copy",difficulty:3,code:`CREATE FUNCTION levenshtein(s1 VARCHAR(255), s2 VARCHAR(255))
RETURNS INT
BEGIN
  DECLARE len1 INT;
  DECLARE len2 INT;
  DECLARE i INT;
  DECLARE j INT;
  DECLARE cost INT;
  DECLARE dp ARRAY;
  
  SET len1 = LENGTH(s1);
  SET len2 = LENGTH(s2);
  
  IF len1 = 0 THEN RETURN len2;
  ELSEIF len2 = 0 THEN RETURN len1;
  END IF;
  
  -- Simplified implementation
  RETURN ABS(len1 - len2);
END;`,explanation:"编辑距离"},{id:"sql_func_010",type:"copy",difficulty:2,code:`CREATE FUNCTION mask_email(email VARCHAR(255))
RETURNS VARCHAR(255)
BEGIN
  DECLARE at_pos INT;
  DECLARE username VARCHAR(255);
  DECLARE domain VARCHAR(255);
  
  SET at_pos = POSITION('@' IN email);
  IF at_pos <= 1 THEN RETURN email;
  END IF;
  
  SET username = SUBSTRING(email, 1, at_pos - 1);
  SET domain = SUBSTRING(email, at_pos);
  
  RETURN CONCAT(LEFT(username, 1), '***', domain);
END;

SELECT mask_email('user@example.com');`,explanation:"邮箱脱敏"},{id:"sql_func_011",type:"copy",difficulty:1,code:`CREATE FUNCTION abs_diff(a INT, b INT)
RETURNS INT
BEGIN
  RETURN ABS(a - b);
END;

SELECT abs_diff(5, 10) as result;`,explanation:"绝对值差"},{id:"sql_func_012",type:"copy",difficulty:3,code:`CREATE FUNCTION generate_slug(title VARCHAR(255))
RETURNS VARCHAR(255)
BEGIN
  DECLARE slug VARCHAR(255);
  SET slug = LOWER(title);
  SET slug = REGEXP_REPLACE(slug, '[^a-z0-9]+', '-');
  SET slug = REGEXP_REPLACE(slug, '^-|-$', '');
  RETURN slug;
END;

SELECT generate_slug('Hello World! How are you?') as slug;`,explanation:"URL slug生成"},{id:"sql_func_013",type:"copy",difficulty:2,code:`CREATE FUNCTION format_number(num INT)
RETURNS VARCHAR(50)
BEGIN
  RETURN FORMAT(num, 0);
END;

SELECT format_number(1234567) as formatted;`,explanation:"数字格式化"},{id:"sql_func_014",type:"copy",difficulty:3,code:`CREATE FUNCTION calculate_bmi(weight DECIMAL(5,2), height DECIMAL(5,2))
RETURNS VARCHAR(20)
BEGIN
  DECLARE bmi DECIMAL(5,2);
  SET bmi = weight / (height * height);
  
  RETURN CASE
    WHEN bmi < 18.5 THEN 'Underweight'
    WHEN bmi < 25 THEN 'Normal'
    WHEN bmi < 30 THEN 'Overweight'
    ELSE 'Obese'
  END;
END;

SELECT calculate_bmi(70, 1.75) as bmi_category;`,explanation:"BMI计算"},{id:"sql_func_015",type:"copy",difficulty:2,code:`CREATE FUNCTION truncate_text(text VARCHAR(1000), max_len INT)
RETURNS VARCHAR(1003)
BEGIN
  IF LENGTH(text) <= max_len THEN
    RETURN text;
  END IF;
  RETURN CONCAT(LEFT(text, max_len), '...');
END;

SELECT truncate_text('This is a very long text that needs to be shortened', 20) as truncated;`,explanation:"文本截断"}],w={language:Qe,module:Ze,questions:Xe};function n(i){return!i||!i.questions?[]:i.questions.map(o=>({...o,language:o.language||i.language,module:o.module||i.module}))}const l={questions:{Java:{loop:n(M),condition:n(U),array:n(f),string:n(J),function:n(y),class:n(y),io:n(f)},Python:{loop:n(tn),condition:n(cn),array:n(m),string:n(yn),function:n(_),class:n(_),io:n(m)},"C++":{loop:n(En),condition:n(vn),array:n(g),string:n(Ln),function:n(h),class:n(h),io:n(g)},JavaScript:{loop:n(Dn),condition:n(Pn),array:n(x),string:n(Kn),function:n(b),class:n(b),io:n(x)},TypeScript:{loop:n(ie),condition:n(ce),array:n(E),string:n(ye),function:n(S),class:n(S),io:n(E)},Linux:{loop:n(Ee),condition:n(ve),array:n(T),string:n(Le),function:n($),class:n($),io:n(T)},SQL:{loop:n(De),condition:n(Pe),array:n(v),string:n(Ke),function:n(w),class:n(w),io:n(v)}},errorPatterns:C.patterns||[],fillPoints:k.blank_positions||[]};async function nt(i,o,t=10,a=null){var r;let c=((r=l.questions[i])==null?void 0:r[o])||[];return a&&(c=c.filter(s=>s.difficulty===a)),c.length===0?(console.log("Pool empty, returning fallback questions"),N(i,o,t)):u([...c]).slice(0,t)}async function tt(i,o,t=10){const a=await nt(i,o,t),c=l.fillPoints;return a.map((r,s)=>{const e=c[s%c.length],{code:p,answers:d}=et(r.code,e);return{...r,type:"fill_blank",code:p,answer:d.length>0?d[0].answer:"",blank_type:e.id}})}async function it(i,o=10){var c;const t=[];for(const r of R.modules){const s=((c=l.questions[i])==null?void 0:c[r])||[];t.push(...s)}if(t.length===0)return N(i,"debug",o);const a=l.errorPatterns.filter(r=>r.applicable_languages.includes(i));return a.length===0?u([...t]).slice(0,o).map(r=>({...r,type:"debug",code_with_bug:r.code,correct_code:r.code,bug_type:"syntax",explanation:"代码纠错练习"})):u([...t]).slice(0,o).map((r,s)=>{const e=a[s%a.length],p=O(r.code,e.id);return{...r,type:"debug",code_with_bug:p,correct_code:r.code,bug_type:e.category,explanation:e.description}})}function N(i,o,t){const a=[];for(let c=0;c<t;c++)a.push({id:`fallback_${o}_${c}`,language:i,module:o,type:"copy",difficulty:1,code:`// ${i} ${o} 示例
// TODO: 添加更多题目`,explanation:"待补充题目"});return a}function et(i,o){const t=i.split(`
`),a=[];let c=!1;for(let r=0;r<t.length&&!c;r++){const s=t[r];switch(o.id){case"variable_name":{const e=s.match(/(?:int|String|double|boolean|var|let|def)\s+(\w+)/);e&&(a.push({type:"variable",answer:e[1]}),t[r]=s.replace(e[1],"___"),c=!0);break}case"condition":case"loop_condition":{const e=s.match(/(?:if|while|for)\s*\((.+?)\)/);e&&(a.push({type:"condition",answer:e[1]}),t[r]=s.replace(e[1],"___"),c=!0);break}case"operator":{const e=s.match(/([+\-*/%&|^<>=!]+)/);e&&e[1].length<=2&&(a.push({type:"operator",answer:e[1]}),t[r]=s.replace(e[1],"___"),c=!0);break}case"function_param":{const e=s.match(/(?:int|String|double|boolean|float|long)\s+(\w+)\s*[,)]/);e&&(a.push({type:"param",answer:e[1]}),t[r]=s.replace(e[1],"___"),c=!0);break}case"method_name":{const e=s.match(/(?:public|private|protected|static|\s)+[\w<>\[\]]+\s+(\w+)\s*\(/);e&&(a.push({type:"method",answer:e[1]}),t[r]=s.replace(e[1],"___"),c=!0);break}case"return_value":{const e=s.match(/return\s+(.+?);/);e&&(a.push({type:"return",answer:e[1]}),t[r]=s.replace(e[1],"___"),c=!0);break}case"array_index":{const e=s.match(/\[(\w+)\]/);e&&(a.push({type:"index",answer:e[1]}),t[r]=s.replace(e[1],"___"),c=!0);break}default:{const e=s.match(/\b(\w+)\b/);e&&(a.push({type:"identifier",answer:e[1]}),t[r]=s.replace(e[1],"___"),c=!0)}}}return{code:t.join(`
`),answers:a}}function u(i){const o=[...i];for(let t=o.length-1;t>0;t--){const a=Math.floor(Math.random()*(t+1));[o[t],o[a]]=[o[a],o[t]]}return o}export{tt as a,it as b,nt as g};
