---
title: "Unit tests"
heading: "Unit tests for the Mattermost Web app"
description: "Review our guidelines for unit testing for your Mattermost webapp, including a guide on how to do component testing."
date: 2018-11-20T11:35:32-04:00
weight: 5
aliases:
  - /contribute/webapp/unit-testing
---

### Unit Tests for Component and Utility Files

The last required step in building a web app component is to test it. {{<newtabref href="https://jestjs.io/en/" title="Jest">}}and {{<newtabref href="https://airbnb.io/enzyme/" title="Enzyme">}}are the main frameworks/testing utilities used in unit testing components and utility files of the `mattermost-webapp` repository. Please visit their respective documentation for detailed information on how to get started, best practices, and updates. Enzyme is used to render and interact with React components in isolation, while Jest is used to perform snapshot testing against these components.

If you need to unit test something related to Redux, please check out [Redux Unit and E2E Testing]({{<relref "/contribute/more-info/webapp/redux/testing.md">}}).

#### Writing unit tests
Below is a brief guide on how to do component testing:

1. Match snapshots using default or expected props. Use shallow rendering to render just the component itself, and not any of its child components. Note that while using snapshots is convenient, do not rely solely on this for every test case, as changes can be easily overlooked when using the command `jest -updateSnapshot` to update multiple snapshots at once. For example:
    ```javascript
    const baseProps = {
        active: true,
        onSubmit: jest.fn(),
    };

    test('should match snapshot, not send email notifications', () => {
        const wrapper = shallow(<EmailNotificationSetting {...baseProps}/>);

        expect(wrapper).toMatchSnapshot();

        // Save a snapshot of part of a component when it has another render function like "renderOption".
        // This creates a small snapshot of that particular render function's result instead of the entire component.
        expect(wrapper.instance().renderOption()).toMatchSnapshot();
    });
    ```
2. Use assertions to verify the existence and properties of important elements.
    ```javascript
    expect(wrapper.find('#emailNotificationImmediately').exists()).toBe(true);
    expect(wrapper.find('h1').text()).toEqual(props.siteName);
    expect(wrapper.find('h4').text()).toEqual(props.customDescriptionText);
    ```
3. You should also use assertions to check CSS classes.
    ```javascript
    expect(wrapper.find('#create_post').hasClass('center')).toBe(true);
    ```
4. Simulate events and verify state changes accordingly.
    ```javascript
    test('should pass handleChange', () => {
        const wrapper = mountWithIntl(<EmailNotificationSetting {...baseProps}/>);
        wrapper.find('#emailNotificationImmediately').simulate('change');

        expect(wrapper.state('enableEmail')).toBe('true');
        expect(wrapper.state('emailInterval')).toBe(30);
    });
    ```
5. Ensure that all functions of a component are tested. This can be done via events, state changes, or just calling it directly.
    ```javascript
    const baseProps = {
        updateSection: jest.fn(),
    };

    test('should call updateSection on handleExpand', () => {
        // Jest mocks are automatically cleared between tests, so they don't need to be redefined.
        const wrapper = mountWithIntl(<EmailNotificationSetting {...baseProps}/>);

        wrapper.instance().handleExpand();

        expect(baseProps.updateSection).toBeCalled();
        expect(baseProps.updateSection).toHaveBeenCalledTimes(1);
        expect(baseProps.updateSection).toBeCalledWith('email');
    });
    ```

6. When a function is passed to a component via props, make sure to test if it gets called for a particular event call or its state changes.
    ```javascript
    const baseProps = {
        onSubmit: jest.fn(),
        updateSection: jest.fn(),
    };

    test('should call functions on handleSubmit', () => {
        const wrapper = mountWithIntl(<EmailNotificationSetting {...baseProps}/>);

        wrapper.instance().handleSubmit();

        expect(baseProps.onSubmit).not.toBeCalled();
        expect(baseProps.updateSection).toHaveBeenCalledTimes(1);
        expect(baseProps.updateSection).toBeCalledWith('');

        wrapper.find('#emailNotificationNever').simulate('change');
        wrapper.instance().handleSubmit();

        expect(baseProps.onSubmit).toBeCalled();
        expect(baseProps.onSubmit).toHaveBeenCalledTimes(1);
        expect(baseProps.onSubmit).toBeCalledWith({enableEmail: 'false'});

        expect(baseProps.updateSection).toHaveBeenCalledTimes(2);
        expect(baseProps.updateSection).toBeCalledWith('');
    });
    ```
7. Provide a mock for a single function imported from another file while keeping the original version of the rest of that file's exports.
    ```javascript
    jest.mock('utils/utils', () => {
        const original = jest.requireActual('utils/utils');
        return {
            ...original,
            isMobileView: jest.fn(() => true),
        };
    });
    ```
8.  Mock async ``redux`` actions as necessary while providing a readable action type and having them pass their arguments.
    ```javascript
    jest.mock('mattermost-redux/actions/channels', () => {
        const original = jest.requireActual('mattermost-redux/actions/channels');
        return {
            ...original,
            fetchMyChannelsAndMembers: (...args) => ({type: 'MOCK_FETCH_CHANNELS_AND_MEMBERS', args}),
        };
    });

    // Then compare the dispatched actions
    await testStore.dispatch(Actions.loadChannelsForCurrentUser());
    expect(testStore.getActions()).toEqual(expectedActions);
    ```
9. For utility functions, list all test cases with test description, input and output.
    ```javascript
    describe('stripMarkdown | RemoveMarkdown', () => {
        const testCases = [{
            description: 'emoji: same',
            inputText: 'Hey :smile: :+1: :)',
            outputText: 'Hey :smile: :+1: :)',
        },
        {
            description: 'at-mention: same',
            inputText: 'Hey @user and @test',
            outputText: 'Hey @user and @test',
        }];

        testCases.forEach((testCase) => {
            test(testCase.description, () => {
                expect(stripMarkdown(testCase.inputText)).toEqual(testCase.outputText);
            });
        });
    }
    ```
#### Running unit tests
10. To run all tests that have been modified or added since the last commit, run {{<newtabref href="https://jestjs.io/en/" title="Jest">}} in `watch` mode with the command: `npm run test:watch`.
    * If there are new tests in the first run, test snapshots will be generated and placed in the `__snapshots__` directory in the folder where the test suite is located.
    * In watch mode, you can also run specific sets of tests:

        ```
        › Press a to run all tests.
        › Press f to run only failed tests.
        › Press o to only run tests related to changed files.
        › Press q to quit watch mode.
        › Press p to filter by a filename regex pattern.
        › Press t to filter by a test name regex pattern.
        › Press Enter to trigger a test run.
        ```
        * To see if a component test passes, select `p` in `watch` mode and enter the filename for the component test.

11. Check test coverage by running `npm run test:coverage`, and then opening up the corresponding generated html reports in the `coverage/lcov-report/components` folder. Update tests if necessary - however, note that it's not a requirement to meet 100% coverage of a component, especially if it will involve unnecessary or complicated mocking. Uncovered lines, statements, branches or functions will be recorded so that they will be handled by other forms of testing like integration or end-to-end testing.

#### Troubleshooting

* If you get an error similar to `UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'filter' of undefined`:

    - Check if the code being tested uses native timer functions (i.e., `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`). You can mock the timers and/or run fake timers (e.g. `jest.useFakeTimers()`) if necessary. Note that `jest.useFakeTimers()` is already used in the {{<newtabref href="https://github.com/mattermost/mattermost-webapp/blob/master/tests/setup.js" title="Jest global setup">}}, but there are cases where it needs to run specifically depending on how the component uses the native timer functions.
    <br><br/>

* If you get an error similar to `UnhandledPromiseRejectionWarning: TypeError: (0 , \_fff.hhh) is not a function`:

    - Check if you're mocking part of an imported module without providing other exports which are used. You can use `jest.requireActual` to get the un-mocked version of the file.

        ```javascript
        // DO NOT partially mock the module
        jest.mock('actions/storage', () => ({
            setGlobalItem: (...args) => ({type: 'MOCK_SET_GLOBAL_ITEM', args}),
        }));

        // DO fully mock the module
        jest.mock('actions/storage', () => {
            const original = jest.requireActual('actions/storage');
            return {
                ...original,
                setGlobalItem: (...args) => ({type: 'MOCK_SET_GLOBAL_ITEM', args}),
            };
        });
        ```

* If you get an error similar to `UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'data' of undefined`:

    - Use async mock functions with resolved values. The property in question that cannot be read can be `error`, `data`, `exists`, `match`, or whatever else the resolved value(s) contains. For example, if the file being tested contains a line where it awaits on an async value like:

        ```javascript
        const {data} = await this.props.actions.addUsersToTeam(this.props.currentTeamId, userIds);
        ```
   
        The mocked function should return a Promise by using `mockResolvedValue`:

        ```javascript
        // DO NOT assign a regular mock function.
        const addUsersToTeam = jest.fn();

        // DO NOT forget to provide a resolved value.
        const addUsersToTeam: jest.fn(() => {
            return new Promise((resolve) => {
                process.nextTick(() => resolve());
            });
        }),

        // DO mock async function with resolved value. `mockResolvedValue` is the easiest way to do this.
        const addUsersToTeam = jest.fn().mockResolvedValue({data: true})

        // DO mock async function with several resolved values for repeated calls.
        const addUsersToTeam = jest.fn().
        mockResolvedValueOnce({error: true}).
        mockResolvedValue({data: true});
        ```

        Remember to make individual test cases async when testing async functions:

        ```javascript
        // DO NOT forget to wait for the async function to complete.
        test('should match state when handleSubmit is called', () => {
            wrapper.instance().handleSubmit();
            expect(...)
        });

        // DO remember to wait on the async function and to make the entire test case async.
        test('should match state when handleSubmit is called', async () => {
            await wrapper.instance().handleSubmit();
            expect(addUsersToTeam).toHaveBeenCalledTimes(1);
        });
        ```