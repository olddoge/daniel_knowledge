---
title: Something Code
date: 2026-07-16 15:22:28
tags: ['java', 'python', 'javascript', 'php']
categories: ['代码', '测试']
---


# 常用编程语言代码片段合集

## Python

```python
from datetime import datetime

def greet(name: str) -> str:
    return f"Hello, {name}! Today is {datetime.now().date()}"

users = ["Alice", "Bob", "Charlie"]

for user in users:
    print(greet(user))
```

---

## JavaScript

```javascript
async function fetchUser(id) {
    try {
        const response = await fetch(
            `https://api.example.com/users/${id}`
        );

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Request failed:", error);
    }
}

fetchUser(1001).then(console.log);
```

---

## TypeScript

```typescript
interface User {
    id: number;
    name: string;
    email?: string;
}

class UserService {
    private users: User[] = [];

    addUser(user: User): void {
        this.users.push(user);
    }

    getUsers(): User[] {
        return this.users;
    }
}

const service = new UserService();

service.addUser({
    id: 1,
    name: "Daniel",
    email: "daniel@example.com"
});

console.log(service.getUsers());
```

---

## Java

```java
import java.util.ArrayList;
import java.util.List;

public class Main {

    public static void main(String[] args) {

        List<String> languages = new ArrayList<>();

        languages.add("Java");
        languages.add("Python");
        languages.add("Go");

        languages.forEach(System.out::println);
    }
}
```

---

## C++

```cpp
#include <iostream>
#include <vector>

int main() {

    std::vector<int> numbers = {
        1, 2, 3, 4, 5
    };

    int sum = 0;

    for (auto n : numbers) {
        sum += n;
    }

    std::cout << "Sum = " << sum << std::endl;

    return 0;
}
```

---

## C#

```csharp
using System;

class Program
{
    static void Main()
    {
        string[] names =
        {
            "Tom",
            "Jerry",
            "Alice"
        };

        foreach (var name in names)
        {
            Console.WriteLine($"Hello {name}");
        }
    }
}
```

---

## Go

```go
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }

    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    for i := 0; i < 10; i++ {
        fmt.Println(fibonacci(i))
    }
}
```

---

## Rust

```rust
fn main() {

    let numbers = vec![1, 2, 3, 4, 5];

    let sum: i32 = numbers
        .iter()
        .sum();

    println!("Total: {}", sum);
}
```

---

## PHP

```php
<?php

class User
{
    public string $name;

    public function __construct($name)
    {
        $this->name = $name;
    }

    public function sayHello()
    {
        echo "Hello, {$this->name}";
    }
}

$user = new User("Daniel");
$user->sayHello();

?>
```

---

## SQL

```sql
SELECT
    u.name,
    COUNT(o.id) AS order_count,
    SUM(o.amount) AS total_amount
FROM users u
LEFT JOIN orders o
    ON u.id = o.user_id
GROUP BY u.id
HAVING total_amount > 1000
ORDER BY total_amount DESC;
```

---

## Bash

```bash
#!/bin/bash

echo "System Information"

echo "Hostname:"
hostname

echo "Memory:"
free -h

echo "Disk:"
df -h /
```

---

## Kotlin

```kotlin
data class User(
    val id: Int,
    val name: String
)

fun main() {

    val users = listOf(
        User(1, "Alice"),
        User(2, "Bob")
    )

    users.forEach {
        println("${it.id}: ${it.name}")
    }
}
```

---

## Markdown 代码高亮支持

常见 Markdown 代码块语言标识：

```markdown
```python
```javascript
```typescript
```java
```cpp
```csharp
```go
```rust
```php
```sql
```bash
```kotlin
```
```