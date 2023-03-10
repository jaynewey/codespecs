const pythonBubbleSort = `arr = [5, 2, 1, 4, 3]

for i in range(len(arr) - 1):
    swapped = False
    for j in range(len(arr) - i - 1):
        if (arr[j] > arr[j + 1]):
            arr[j], arr[j + 1] = arr[j + 1], arr[j]
            swapped = True
    if not swapped:
        break
`;

const javascriptBubbleSort = `const arr = [5, 2, 1, 4, 3];

for (let i = 0; i < arr.length - 1; i++) {
  let swapped = false;
  for (let j = 0; j < arr.length - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      swapped = true;
    }
  }
  if (!swapped) {
    break;
  }
}
`;

const typescriptBubbleSort = `const arr: number[] = [5, 2, 1, 4, 3];

for (let i = 0; i < arr.length - 1; i++) {
  let swapped: boolean = false;
  for (let j = 0; j < arr.length - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      swapped = true;
    }
  }
  if (!swapped) {
    break;
  }
}
`;

const cppBubbleSort = `int main() {
    int arr[] = { 5, 2, 1, 4, 3 };

    int n = sizeof(arr) / sizeof(arr[0]);
    int i, j;
    bool swapped;
    for (i = 0; i < n - 1; i++) {
        swapped = false;
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (swapped == false)
            break;
    }
}
`;

const cBubbleSort = `#include <stdbool.h>

int main() {
    int arr[] = { 5, 2, 1, 4, 3 };

    int n = sizeof(arr) / sizeof(arr[0]);
    int i, j;
    bool swapped;
    for (i = 0; i < n - 1; i++) {
        swapped = false;
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (swapped == false)
            break;
    }
}
`;

const rustBubbleSort = `fn main() {
    let mut arr = [5, 2, 1, 4, 3];
    let mut swapped;

    for i in 0..arr.len() {
        swapped = false;
        for j in 0..arr.len() - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
                swapped = true;
            }
        }

        if !swapped {
            break;
        }
    }
}
`;

const csBubbleSort = `namespace HelloWorld {
    class Program {
        static void Main(string[] args) {
            int[] arr = { 5, 2, 1, 4, 3 };

            bool swapped;
            for (int i = 0; i < arr.Length; i++) {
                swapped = false;
                for (int j = 0; j < arr.Length - i - 1; j++) {
                    if (arr[j] > arr[j + 1]) {
                        int temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                        swapped = true;
                    }
                }
                if (!swapped) {
                    break;
                }
            }
        }
    }
}
`;

export const codeMap: { [key: string]: string } = {
  "python (via debugpy)": pythonBubbleSort,
  "javascript (via node-debug2)": javascriptBubbleSort,
  "typescript (via node-debug2)": typescriptBubbleSort,
  "c++ (via codelldb)": cppBubbleSort,
  "c (via codelldb)": cBubbleSort,
  "rust (via codelldb)": rustBubbleSort,
  "c# (via netcoredbg)": csBubbleSort,
};
