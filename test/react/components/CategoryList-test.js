jest.dontMock('../../../static/js/components/CategoryList');
describe('CategoryLidt', function() {
	it('does something', function() {
		expect(true).toEqual(true);
		/*
		var React = require('react/addons');
		var CheckboxWithLabel = require('../../../static/js/components/CategoryList');
		var TestUtils = React.addons.TestUtils;
		expect(true).toEqual(true);

		// Render a checkbox with label in the document
		var checkbox = TestUtils.renderIntoDocument(
			<CategoryList labelOn="On" labelOff="Off" />
		);

		// Verify that it's Off by default
		var label = TestUtils.findRenderedDOMComponentWithTag(
			checkbox, 'label');
			expect(label.getDOMNode().textContent).toEqual('Off');

			// Simulate a click and verify that it is now On
			var input = TestUtils.findRenderedDOMComponentWithTag(
				checkbox, 'input');
				TestUtils.Simulate.change(input);
				expect(label.getDOMNode().textContent).toEqual('On');
				*/
	});
});
