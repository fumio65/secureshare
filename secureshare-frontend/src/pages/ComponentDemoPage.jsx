import { useState } from 'react';
import { Palette, Download, Mail, Search } from 'lucide-react';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../components/common/Modal';
import Alert from '../components/common/Alert';
import Card, { CardHeader, CardBody, CardFooter, CardTitle, CardDescription } from '../components/common/Card';

const ComponentDemoPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-950/30 rounded-2xl mb-6">
              <Palette className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Component Library Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Testing all custom UI components with theme support
            </p>
          </div>

          <div className="space-y-12">
            {/* Buttons Section */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Custom Buttons</CardTitle>
                  <CardDescription>
                    Multi-variant button component with loading states and sizes
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    {/* Button Variants */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Variants</h4>
                      <div className="flex flex-wrap gap-3">
                        <CustomButton variant="primary">Primary</CustomButton>
                        <CustomButton variant="secondary">Secondary</CustomButton>
                        <CustomButton variant="success">Success</CustomButton>
                        <CustomButton variant="danger">Danger</CustomButton>
                        <CustomButton variant="warning">Warning</CustomButton>
                        <CustomButton variant="outline">Outline</CustomButton>
                        <CustomButton variant="ghost">Ghost</CustomButton>
                      </div>
                    </div>

                    {/* Button Sizes */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sizes</h4>
                      <div className="flex flex-wrap items-center gap-3">
                        <CustomButton size="xs">Extra Small</CustomButton>
                        <CustomButton size="sm">Small</CustomButton>
                        <CustomButton size="md">Medium</CustomButton>
                        <CustomButton size="lg">Large</CustomButton>
                        <CustomButton size="xl">Extra Large</CustomButton>
                      </div>
                    </div>

                    {/* Button States */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">States</h4>
                      <div className="flex flex-wrap gap-3">
                        <CustomButton>Normal</CustomButton>
                        <CustomButton disabled>Disabled</CustomButton>
                        <CustomButton loading={loading} onClick={handleLoadingDemo}>
                          {loading ? 'Loading...' : 'Click for Loading'}
                        </CustomButton>
                        <CustomButton fullWidth>Full Width</CustomButton>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </section>

            {/* Inputs Section */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Custom Inputs</CardTitle>
                  <CardDescription>
                    Input fields with validation, icons, and password toggle
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomInput
                      label="Basic Input"
                      placeholder="Enter some text..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />

                    <CustomInput
                      label="Email Input"
                      type="email"
                      placeholder="your@email.com"
                      leftIcon={<Mail className="h-4 w-4" />}
                      helperText="We'll never share your email"
                    />

                    <CustomInput
                      label="Password Input"
                      type="password"
                      placeholder="Enter password..."
                      value={passwordValue}
                      onChange={(e) => setPasswordValue(e.target.value)}
                      required
                    />

                    <CustomInput
                      label="Search Input"
                      placeholder="Search..."
                      leftIcon={<Search className="h-4 w-4" />}
                      size="lg"
                    />

                    <CustomInput
                      label="Error State"
                      placeholder="This has an error..."
                      error="This field is required"
                    />

                    <CustomInput
                      label="Success State"
                      placeholder="This is valid!"
                      success="Looks good!"
                    />

                    <CustomInput
                      label="Disabled Input"
                      placeholder="Can't type here..."
                      disabled
                      value="Disabled value"
                    />

                    <CustomInput
                      label="Small Input"
                      placeholder="Small size..."
                      size="sm"
                    />
                  </div>
                </CardBody>
              </Card>
            </section>

            {/* Alerts Section */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Alert Components</CardTitle>
                  <CardDescription>
                    Notification alerts with different variants and dismissible options
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <Alert variant="success" title="Success!">
                      Your file has been uploaded successfully.
                    </Alert>

                    <Alert variant="error" title="Error occurred" dismissible>
                      Failed to upload file. Please try again.
                    </Alert>

                    <Alert variant="warning" title="Warning">
                      Your free storage is almost full.
                    </Alert>

                    <Alert variant="info" title="Information" dismissible>
                      Your account will expire in 7 days.
                    </Alert>

                    <Alert variant="info">
                      This is a simple alert without a title.
                    </Alert>
                  </div>
                </CardBody>
              </Card>
            </section>

            {/* Cards Section */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Card Components</CardTitle>
                  <CardDescription>
                    Flexible card containers with different variants and compositions
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card variant="default" hover>
                      <CardTitle>Default Card</CardTitle>
                      <CardDescription className="mt-2">
                        This is a hoverable card with default styling.
                      </CardDescription>
                      <CardFooter>
                        <CustomButton size="sm" fullWidth>Action</CustomButton>
                      </CardFooter>
                    </Card>

                    <Card variant="elevated">
                      <CardTitle>Elevated Card</CardTitle>
                      <CardDescription className="mt-2">
                        This card has more prominent shadow.
                      </CardDescription>
                    </Card>

                    <Card variant="outlined">
                      <CardTitle>Outlined Card</CardTitle>
                      <CardDescription className="mt-2">
                        This card uses border instead of shadow.
                      </CardDescription>
                    </Card>

                    <Card variant="flat" padding="lg">
                      <CardTitle>Flat Card</CardTitle>
                      <CardDescription className="mt-2">
                        No shadow, large padding.
                      </CardDescription>
                    </Card>

                    <Card padding="sm">
                      <CardTitle>Small Padding</CardTitle>
                      <CardDescription className="mt-2">
                        Compact card with small padding.
                      </CardDescription>
                    </Card>

                    <Card onClick={() => setModalOpen(true)} hover>
                      <CardTitle>Clickable Card</CardTitle>
                      <CardDescription className="mt-2">
                        Click me to open a modal!
                      </CardDescription>
                    </Card>
                  </div>
                </CardBody>
              </Card>
            </section>

            {/* Modal Section */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Modal Component</CardTitle>
                  <CardDescription>
                    Accessible modal with backdrop, escape key handling, and composable parts
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <div className="flex gap-3">
                    <CustomButton onClick={() => setModalOpen(true)}>
                      Open Modal
                    </CustomButton>
                  </div>
                </CardBody>
              </Card>
            </section>

            {/* Success Message */}
            <Alert variant="success" title="Task 2.2 Complete!">
              All custom UI components are working perfectly with full theme support, 
              accessibility features, and comprehensive customization options.
            </Alert>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Demo Modal"
        size="lg"
      >
        <ModalHeader>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Modal Header
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            This is a demonstration of the modal component with proper composition.
          </p>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            <CustomInput
              label="Email"
              type="email"
              placeholder="Enter your email..."
              leftIcon={<Mail className="h-4 w-4" />}
            />
            <CustomInput
              label="Message"
              placeholder="Enter your message..."
              helperText="This field is optional"
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <CustomButton variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </CustomButton>
          <CustomButton onClick={() => setModalOpen(false)}>
            Save Changes
          </CustomButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ComponentDemoPage;