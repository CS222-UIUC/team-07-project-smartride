# test.py, useless but to test GitHub whether it can demonstrate status_checks correctly by triggering py-type-check, backend-test and format-check workflows


def test_function() -> None:
    # This is a test function that does nothing but is written correctly
    print("This is a test function that does nothing but is written correctly.")


# A function to demonstrate type hinting without any real use
def add_numbers(a: int, b: int) -> int:
    return a + b


if __name__ == "__main__":
    test_function()
    result = add_numbers(1, 2)
    print(f"Result of add_numbers: {result}")
