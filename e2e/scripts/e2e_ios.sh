#!/bin/sh
if [ "$1" = "rerun" ]; then
  # Re-run the tests against an already prepared setup, skipping prepare/reset.
  ./run_ios_e2e_tests.sh
elif [ "$1" = "reset" ]; then
  # Only restore the original setup (undo a previous prepare).
  ./reset_e2e_tests.sh
else
  ./prep_e2e_tests.sh && ./run_ios_e2e_tests.sh && ./reset_e2e_tests.sh
fi
